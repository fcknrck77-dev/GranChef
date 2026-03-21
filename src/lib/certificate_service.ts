import { getSupabase } from '@/lib/supabaseClient';

export const CertificateService = {
  issue: async (userId: string, courseId: string, courseName: string, score: number) => {
    // Generate a unique hash for the certificate
    const timestamp = Date.now();
    const rawData = `${userId}-${courseName}-${score}-${timestamp}`;
    
    // Simulate a cryptographic signature (HMAC-like)
    const encoder = new TextEncoder();
    const data = encoder.encode(rawData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const certHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const certData = {
      certificateId: certHash.slice(0, 16).toUpperCase(),
      blockchainTx: `0x${certHash.slice(0, 64)}`,
      status: 'Verified on GrandChain',
      issuedAt: new Date(timestamp).toISOString()
    };

    // Save to BUSINESS Shard
    const bus = getSupabase('BUSINESS');
    if (bus) {
      await bus.from('blockchain_certificates').insert({
        user_id: userId,
        course_id: courseId,
        certificate_hash: certData.certificateId,
        blockchain_tx: certData.blockchainTx,
        metadata: { score, courseName, issuedAt: certData.issuedAt }
      });
    }

    return certData;
  },

  verify: async (certId: string) => {
    // Mock verification logic
    return {
      isValid: true,
      issuedTo: 'Usuario Verificado',
      course: 'Maestría en Esferificaciones',
      grade: 'Distinción'
    };
  }
};
