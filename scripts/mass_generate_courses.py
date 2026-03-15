import os
import json
import time
import socket
from supabase import create_client, Client
from openai import OpenAI

# --- CONFIGURACIÓN ---
# Project Ref: yqjwqhnconfynnkzkzuur
SUPABASE_URL = os.getenv("SUPABASE_URL")
# Service Role Key (secreta): definir como variable de entorno
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Configuración IA (OpenRouter)
AI_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
AI_API_KEY = os.getenv("OPENROUTER_API_KEY")
AI_MODEL = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.1-8b-instruct")

def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value

# Clientes
supabase: Client = create_client(require_env("SUPABASE_URL"), require_env("SUPABASE_SERVICE_ROLE_KEY"))
ai_client = OpenAI(base_url=AI_BASE_URL, api_key=require_env("OPENROUTER_API_KEY"))

def generate_course_content(tier, day, extra_instruction=""):
    print(f"Generando curso para {tier} - Día {day}...")
    
    prompt = f"""
    Eres un experto en gastronomía molecular y ciencia culinaria. 
    Genera un curso profesional para 'GrandChef Lab' en ESPAÑOL.
    Nivel: {tier}. Día de liberación: {day}.
    
    Instrucción especial del administrador: {extra_instruction if extra_instruction else "Ninguna (seguir estándar premium)"}
    
    REQUISITOS POR NIVEL:
    - FREE: Conceptos introductorios. 1 módulo.
    - PRO: Técnicas avanzadas y química. 2-3 módulos.
    - PREMIUM: MasterClass extensa y extremadamente profesional. 5+ módulos detallados.
    
    Estructura JSON:
    {{
        "title": "...",
        "description": "...",
        "instructor": "...",
        "category": "Técnicas",
        "reading_time": "15 min",
        "modules": [
            {{ "id": 1, "title": "...", "content": "..." }}
        ]
    }}
    """
    
    try:
        response = ai_client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {{"role": "system", "content": "Eres un chef científico de vanguardia."}},
                {{"role": "user", "content": prompt}}
            ],
            response_format={{"type": "json_object"}}
        )
        
        course_data = json.loads(response.choices[0].message.content)
        course_data["tier"] = tier
        course_data["days_required"] = day
        return course_data
    except Exception as e:
        print(f"Error en IA: {e}")
        return None

def save_to_supabase(course_data):
    try:
        res = supabase.table("courses").insert(course_data).execute()
        print(f"✅ Guardado en Supabase: {course_data['title']}")
    except Exception as e:
        print(f"❌ Error al guardar: {e}")

def process_admin_requests():
    """Busca peticiones pendientes del panel de administración (Órdenes de Admin)"""
    try:
        res = supabase.table("ai_requests").select("*").eq("status", "pending").execute()
        requests = res.data
        if not requests:
            return

        for req in requests:
            print(f"🚀 Procesando orden de Admin: {req['instruction']}")
            # Marcar como procesando
            supabase.table("ai_requests").update({"status": "processing"}).eq("id", req["id"]).execute()
            
            # Buscamos el último día generado para saber por dónde seguir
            last_day_res = supabase.table("courses").select("days_required").order("days_required", desc=True).limit(1).execute()
            start_day = (last_day_res.data[0]["days_required"] + 1) if last_day_res.data else 1
            
            days_to_gen = req.get("days_to_generate", 7)
            for day in range(start_day, start_day + days_to_gen):
                for tier in ["FREE", "PRO", "PREMIUM"]:
                    course = generate_course_content(tier, day, req["instruction"])
                    if course:
                        save_to_supabase(course)
            
            # Marcar como completado
            supabase.table("ai_requests").update({"status": "completed"}).eq("id", req["id"]).execute()
    except Exception as e:
        print(f"❌ Error procesando peticiones: {e}")

def mass_generate(days_range=31):
    tiers = ["FREE", "PRO", "PREMIUM"]
    for day in range(1, days_range + 1):
        # Evitar duplicados
        check = supabase.table("courses").select("id").match({{"tier": "FREE", "days_required": day}}).execute()
        if check.data:
            print(f"⏩ Día {day} ya existe. Saltando...")
            continue

        for tier in tiers:
            course = generate_course_content(tier, day)
            if course:
                save_to_supabase(course)
            time.sleep(1)

if __name__ == "__main__":
    # Verificación de DNS antes de empezar
    try:
        socket.gethostbyname("yqjwqhnconfynnkzkzuur.supabase.co")
    except:
        print("⚠️ AVISO: No se puede resolver la URL de Supabase desde esta red.")
        print("Asegúrate de ejecutar este script donde tengas conexión total.")
    
    print("--- INICIANDO SISTEMA OMNISCIENCE AI ---")
    
    # 1. Ejecutar órdenes específicas del Admin
    process_admin_requests()
    
    # 2. Generar contenido base hasta el día 31
    print("Verificando contenido base hasta el día 31...")
    mass_generate(days_range=31) 
    
    print("--- FIN DEL PROCESO ---")
