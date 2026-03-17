'use client';

import { useState } from 'react';

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<'legal' | 'terms' | 'privacy' | 'cookies'>('legal');

  return (
    <div className="policies-page container">
      <header className="policies-header">
        <h1 className="neon-text">Protocolos Legales</h1>
        <p className="subtitle">Textos legales, términos de uso, privacidad y cookies de GrandChef Lab.</p>
      </header>

      <div className="policies-container glass">
        <aside className="policies-sidebar">
          <button 
            className={activeTab === 'legal' ? 'active' : ''} 
            onClick={() => setActiveTab('legal')}
          >
            Aviso Legal
          </button>
          <button 
            className={activeTab === 'terms' ? 'active' : ''} 
            onClick={() => setActiveTab('terms')}
          >
            Términos de Servicio
          </button>
          <button 
            className={activeTab === 'privacy' ? 'active' : ''} 
            onClick={() => setActiveTab('privacy')}
          >
            Privacidad
          </button>
          <button 
            className={activeTab === 'cookies' ? 'active' : ''} 
            onClick={() => setActiveTab('cookies')}
          >
            Política de Cookies
          </button>
        </aside>

        <main className="policies-content">
          {activeTab === 'legal' && (
            <article className="policy-article">
              <h2>Aviso Legal y Condiciones Generales</h2>
              <p>El presente aviso legal regula el uso y utilización de la plataforma GrandChef Lab. La navegación por la plataforma atribuye la condición de Usuario e implica la aceptación plena y sin reservas de todas las disposiciones incluidas en este Aviso Legal.</p>
              
              <section>
                <h3>1. Información de Identificación (LSSI-CE)</h3>
                <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se exponen los datos identificativos del titular de esta plataforma:</p>
                <ul>
                  <li><strong>Titular:</strong> Jesus Fernandez</li>
                  <li><strong>NIF/DNI:</strong> 10902936Q</li>
                  <li><strong>Domicilio a efectos de notificaciones:</strong> Oviedo, España</li>
                  <li><strong>Correo Electrónico de Contacto:</strong> <a href="mailto:info@grandchefapp.es" style={{color: 'var(--primary)', fontWeight: 'bold'}}>info@grandchefapp.es</a></li>
                  <li><strong>Actividad principal:</strong> Plataforma digital interactiva orientada a la formación y experimentación en el ámbito de la gastronomía y tecnología alimentaria mediante Inteligencia Artificial.</li>
                </ul>
              </section>

              <section>
                <h3>2. Finalidad de la Plataforma</h3>
                <p>La plataforma GrandChef Lab proporciona tecnologías avanzadas de simulación molecular, enciclopedia y MasterClasses interactivas estructuradas en distintos niveles de suscripción. El objetivo es puramente educativo, instructivo e inspiracional para el sector culinario.</p>
              </section>

              <section>
                <h3>3. Condiciones de Acceso y Uso</h3>
                <p>El acceso a la plataforma es de carácter condicionado a registro en sus niveles superiores. El Usuario se compromete a hacer un uso lícito, diligente y responsable de la plataforma, absteniéndose de utilizar los contenidos con fines ilícitos, lesivos de los intereses o derechos de terceros, o que puedan dañar o sobrecargar el servicio.</p>
              </section>
              
              <section>
                <h3>4. Responsabilidad</h3>
                <p>El Titular no asume ninguna responsabilidad derivada del uso incorrecto, inapropiado o ilícito de la información aparecida en la plataforma. Las experimentaciones físicas que el Usuario decida llevar a cabo ("Laboratory") basadas en la información química o culinaria aquí presentada corren enteramente bajo su propio riesgo.</p>
                <p>El Titular se reserva el derecho de actualizar, modificar o eliminar la información contenida en la plataforma, pudiendo incluso limitar o no permitir el acceso a dicha información, sin previo aviso.</p>
              </section>
            </article>
          )}

          {activeTab === 'terms' && (
            <article className="policy-article">
              <h2>1. Términos de Servicio y Condiciones de Uso</h2>
              <p><strong>Última actualización:</strong> Marzo 2026</p>
              <p>Bienvenido a <strong>GrandChef Lab</strong>. Al acceder, registrarse o utilizar nuestra plataforma, usted acepta quedar vinculado legalmente por los siguientes términos técnicos y operativos.</p>
              
              <section>
                <h3>1.1 Identificación del Titular</h3>
                <p>En cumplimiento con la normativa legal vigente (Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico - LSSI-CE), se informa que el titular y responsable de la plataforma GrandChef Lab es:</p>
                <ul>
                  <li><strong>Titular:</strong> Jesus Fernandez</li>
                  <li><strong>NIF/NIE/DNI:</strong> 10902936Q</li>
                  <li><strong>Domicilio:</strong> Oviedo, España</li>
                  <li><strong>Correo Electrónico:</strong> <a href="mailto:info@grandchefapp.es" style={{color: 'var(--primary)', fontWeight: 'bold'}}>info@grandchefapp.es</a></li>
                </ul>
              </section>

              <section>
                <h3>1.2 Objeto y Descripción del Servicio</h3>
                <p>GrandChef Lab es una plataforma avanzada que ofrece contenido especializado en el ámbito culinario y gastronómico (MasterClasses, Laboratorio y Enciclopedia). El acceso a la plataforma permite a los usuarios interactuar con algoritmos de maridaje, descripciones técnicas y contenido educativo.</p>
              </section>

              <section>
                <h3>1.3 Propiedad Intelectual e Industrial</h3>
                <p>Todo el código fuente, diseño, interfaces, logotipos, textos, algoritmos de maridaje, descripciones técnicas, vídeos, MasterClasses sintetizadas y el resto del contenido de la plataforma son propiedad exclusiva de Jesus Fernandez o de sus licenciantes, estando protegidos por las leyes de propiedad intelectual e industrial.</p>
                <p>Queda terminantemente prohibida la reproducción, distribución, comunicación pública, transformación o extracción masiva de datos (scraping) total o parcial, sin la autorización expresa y por escrito del titular.</p>
              </section>

              <section>
                <h3>1.4 Niveles de Acceso, Suscripciones y Pagos</h3>
                <p>El acceso a las funcionalidades técnicas está categorizado en niveles de suscripción: FREE, PRO y PREMIUM.</p>
                <ul>
                  <li><strong>Suscripciones de Pago:</strong> Las suscripciones PRO y PREMIUM están sujetas a un pago periódico (mensual o anual) según las tarifas vigentes detalladas en la plataforma.</li>
                  <li><strong>Renovación Automática:</strong> Las suscripciones se renovarán automáticamente por períodos sucesivos de igual duración al contratado inicialmente, utilizando el método de pago proporcionado.</li>
                  <li><strong>Cancelación:</strong> Para evitar la renovación automática, el usuario podrá cancelar su suscripción desde su panel de control o enviando un correo electrónico a <strong>info@grandchefapp.es</strong> con al menos 48 horas de antelación al inicio del nuevo ciclo de facturación. No se realizarán reembolsos por períodos ya iniciados.</li>
                </ul>
              </section>

              <section>
                <h3>1.5 Responsabilidad y Exclusión de Garantías</h3>
                <p>Las simulaciones, algoritmos y procedimientos proporcionados por el módulo <em>Laboratory</em> o <em>Encyclopedia</em> son estimaciones teóricas e instructivas basadas en conocimiento y química culinaria. GrandChef Lab no se hace responsable de:</p>
                <ul>
                  <li>Ejecuciones físicas fallidas de recetas o experimentos culinarios.</li>
                  <li>Reacciones alérgicas, intolerancias alimentarias o problemas de salud derivados de la manipulación, consumo o uso indebido de los ingredientes, reactivos e instrumentos mencionados en la plataforma.</li>
                  <li>Daños directos o indirectos derivados de interrupciones del servicio, caídas de la red o accesos no autorizados a la plataforma por terceros.</li>
                </ul>
                <p>El usuario utiliza la plataforma bajo su propia y exclusiva responsabilidad.</p>
              </section>

              <section>
                <h3>1.6 Legislación Aplicable y Jurisdicción</h3>
                <p>Para la resolución de todas las controversias o cuestiones relacionadas con la plataforma o las actividades en ella desarrolladas, será de aplicación la legislación española. Las partes se someten a la jurisdicción de los Juzgados y Tribunales de Oviedo (España), salvo que la ley establezca otra jurisdicción como el domicilio del consumidor final.</p>
              </section>
            </article>
          )}

          {activeTab === 'privacy' && (
            <article className="policy-article">
              <h2>2. Política de Privacidad de Datos</h2>
              <p>Cumpliendo estrictamente con el Reglamento General de Protección de Datos (RGPD) en vigor en Europa y la Ley Orgánica 3/2018 (LOPDGDD), le informamos sobre el tratamiento de sus datos de carácter personal en GrandChef Lab.</p>
              
              <section>
                <h3>2.1 Responsable del Tratamiento</h3>
                <p><strong>Identidad:</strong> Jesus Fernandez<br/>
                <strong>NIF/DNI:</strong> 10902936Q<br/>
                <strong>Dirección:</strong> Oviedo, España<br/>
                <strong>Email de contacto:</strong> <a href="mailto:info@grandchefapp.es" style={{color: 'var(--primary)', fontWeight: 'bold'}}>info@grandchefapp.es</a></p>
              </section>

              <section>
                <h3>2.2 Finalidad y Calidad de la Recogida de Datos</h3>
                <p>Recopilamos la información estrictamente necesaria para la prestación y optimización de nuestros servicios, incluyendo:</p>
                <ul>
                  <li>Gestión de alta, registro y acceso a los niveles de usuario (FREE, PRO, PREMIUM) y administración del perfil.</li>
                  <li>Gestión de la facturación, cobro y mantenimiento de modalidades de pago.</li>
                  <li>Optimización y personalización de algoritmos de recomendación, preferencias de maridaje, recetas guardadas y progreso en las MasterClasses.</li>
                  <li>Envío de comunicaciones técnicas y comerciales (siempre que se disponga del consentimiento), actualizaciones de servicio y notificaciones transaccionales.</li>
                </ul>
              </section>

              <section>
                <h3>2.3 Legitimación e Intercambio Seguro de Datos</h3>
                <p>La base legal para el tratamiento de los datos es la ejecución del contrato de prestación de servicios para el usuario registrado, así como el consentimiento explícito recogido en formularios.</p>
                <p><strong>Protección de Protocolos:</strong> Toda la información, incluido el tráfico de credenciales y datos de facturación, se procesa bajo certificados de seguridad encriptados (SSL/TLS). No compartimos, vendemos, ni cedemos datos a terceros con fines comerciales, exceptuando las cesiones necesarias por obligación legal (pasarelas de cobro homologadas, autoridades competentes).</p>
              </section>

              <section>
                <h3>2.4 Conservación de los Datos</h3>
                <p>Los datos se conservarán mientras se mantenga la relación contractual/servicio activo. Una vez finalizada, se conservarán debidamente bloqueados durante el tiempo exigido por la legislación aplicable (fiscal y contable) para atender a posibles responsabilidades nacidas del tratamiento.</p>
              </section>

              <section>
                <h3>2.5 Ejercicio de sus Derechos (Derechos ARCO y RGPD)</h3>
                <p>Como usuario, tiene derecho a ejercer los siguientes derechos respecto a su información personal:</p>
                <ul>
                  <li>Acceso, rectificación y/o supresión.</li>
                  <li>Limitación u oposición al tratamiento.</li>
                  <li>Portabilidad de los datos.</li>
                </ul>
                <p>Para hacer uso de sus derechos, podrá dirigir una solicitud por escrito adjuntando fotocopia de su DNI o documento identificativo equivalente, al correo: <strong>info@grandchefapp.es</strong>, indicando en el asunto "Protección de Datos". Asimismo, el usuario tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) si considera vulnerados sus derechos.</p>
              </section>
            </article>
          )}

          {activeTab === 'cookies' && (
            <article className="policy-article">
              <h2>3. Política de Cookies</h2>
              <p>Esta plataforma utiliza cookies propias y de terceros para entender cómo interactúa con el sistema, mejorar su nivel de aislamiento de sesión, proporcionar seguridad y medir analíticas. A continuación le explicamos su naturaleza y uso operativo.</p>
              
              <section>
                <h3>3.1 ¿Qué es una cookie?</h3>
                <p>Una cookie es un fichero de texto inofensivo que se descarga en su dispositivo al acceder a determinadas páginas web. Permite a la plataforma almacenar y recuperar información técnica sobre los hábitos de navegación de un usuario o de su equipo.</p>
              </section>

              <section>
                <h3>3.2 Tipos de Cookies que empleamos</h3>
                
                <h4>a) Cookies Técnicas y Estrictamente Necesarias</h4>
                <p>Son aquellas esenciales para el funcionamiento intrínseco de GrandChef Lab. Incluyen:</p>
                <ul>
                  <li>Mantenimiento del estado de autenticación de su sesión (JWT o tokens de acceso).</li>
                  <li>Control y validación de su nivel de suscripción activo (FREE / PRO / PREMIUM).</li>
                  <li>Prevención de fraudes o distribución no autorizada de accesos.</li>
                </ul>
                <p>Sin ellas, la experiencia del Laboratorio fallaría en cadena.</p>

                <h4>b) Cookies Analíticas y de Rendimiento</h4>
                <p>Empleamos herramientas o servicios de análisis anonimizados para cuantificar el número de usuarios y de esta forma mejorar la latencia y la fluidez del motor de búsqueda de la enciclopedia y las simulaciones moleculares. Estos datos no contienen información personal identificativa directa.</p>

                <h4>c) Cookies de Personalización</h4>
                <p>Nos permiten recordar variables en la interfaz (como la pestaña activa en los Protocolos) y sus preferencias globales para agilizar sus futuras visitas a la plataforma.</p>
              </section>

              <section>
                <h3>3.3 Configuración, Desactivación y Eliminación</h3>
                <p>Usted puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones de privacidad del navegador instalado en su ordenador (Chrome, Firefox, Safari, Edge, etc.).</p>
                <p><strong>Atención:</strong> Tenga en cuenta que si desactiva o rechaza las cookies de carácter técnico o necesario, no podremos mantener su sesión iniciada, ni validar su suscripción, por lo que gran parte de los módulos de la aplicación dejarán de estar operativos para usted.</p>
              </section>

              <section>
                <h3>3.4 Cambios y Actualización en la Política de Cookies</h3>
                <p>Podemos modificar esta Política de Cookies en función de nuevas exigencias legislativas, reglamentarias, o con la finalidad de adaptar dicha política a las instrucciones dictadas por la Agencia Española de Protección de Datos. Recomendamos revisar esta política periódicamente.</p>
              </section>
            </article>
          )}
        </main>
      </div>

      <style jsx>{`
        .policies-page { padding: 80px 20px; min-height: 100vh; }
        .policies-header { text-align: center; margin-bottom: 60px; }
        .neon-text { font-size: 3rem; margin-bottom: 10px; font-weight: 800; }
        .subtitle { color: #cccccc; font-size: 1.1rem; }

        .policies-container {
          display: flex;
          max-width: 1200px;
          margin-inline: auto;
          border-radius: 20px;
          border: 1px solid var(--border);
          min-height: 700px;
          background: #050505;
          overflow: hidden;
        }

        .policies-sidebar {
          width: 300px;
          min-width: 300px;
          background: rgba(255,255,255,0.02);
          border-right: 1px solid var(--border);
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .policies-sidebar button {
          background: none;
          border: none;
          color: white;
          padding: 16px 20px;
          text-align: left;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.05rem;
          transition: all 0.3s ease;
          opacity: 0.6;
        }

        .policies-sidebar button:hover {
          background: rgba(255,255,255,0.05);
          opacity: 1;
        }

        .policies-sidebar button.active {
          background: var(--primary);
          color: white;
          opacity: 1;
          box-shadow: 0 0 15px rgba(255, 0, 85, 0.4);
          font-weight: 800;
        }

        .policies-content {
          flex: 1;
          padding: 50px 70px;
          overflow-y: auto;
          max-height: 80vh;
        }

        .policy-article h2 {
          font-size: 2.2rem;
          font-weight: 900;
          margin-bottom: 30px;
          color: var(--primary);
        }

        .policy-article p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #ffffff; /* FORCE WHITE TEXT */
          margin-bottom: 25px;
        }

        .policy-article ul {
          margin-bottom: 30px;
          padding-left: 20px;
          line-height: 1.8;
          font-size: 1.1rem;
          color: #ffffff; /* FORCE WHITE TEXT */
        }

        .policy-article li {
          margin-bottom: 15px;
        }
        
        strong {
          color: white;
          font-weight: 800;
        }

        .policy-article section {
          margin-top: 40px;
        }

        .policy-article section h3 {
          font-size: 1.4rem;
          margin-bottom: 15px;
          color: white;
          font-weight: 800;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 10px;
        }

        .policy-article section h4 {
          font-size: 1.2rem;
          margin-bottom: 15px;
          margin-top: 30px;
          color: var(--primary);
          font-weight: 700;
        }

        @media (max-width: 900px) {
          .policies-container { flex-direction: column; }
          .policies-sidebar { 
            width: 100%; 
            flex-direction: row; 
            flex-wrap: wrap;
            padding: 20px; 
            border-right: none; 
            border-bottom: 1px solid var(--border); 
          }
          .policies-content { padding: 30px 20px; max-height: none; }
          .policy-article h2 { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
}
