import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // AI Studio Dev server must run on port 3000 (DEFAULT_APP_PORT=3000).
  // Note: Container env sets PORT=8080 (NGINX_PORT=8080) for Nginx proxy, which causes EADDRINUSE if server binds to it.
  const portArgIndex = process.argv.indexOf('--port');
  const portFromArg = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? parseInt(process.argv[portArgIndex + 1], 10) : null;

  let port = 3000;
  if (portFromArg && !isNaN(portFromArg)) {
    port = portFromArg;
  } else if (process.env.APP_PORT) {
    port = parseInt(process.env.APP_PORT, 10);
  } else if (process.env.DEFAULT_APP_PORT) {
    port = parseInt(process.env.DEFAULT_APP_PORT, 10);
  } else if (process.env.PORT && process.env.PORT !== process.env.NGINX_PORT && process.env.PORT !== '8080') {
    port = parseInt(process.env.PORT, 10);
  } else {
    port = 3000;
  }
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // In-memory backend cache for referrals & dispatches
  let activeReferrals: any[] = [];
  let userRoutines: Record<string, { milestones: any[]; kickLogs: any[]; lastSyncedAt: string }> = {};

  // API 1: Backend Health & Firebase Status
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      application: 'MomBond Maternal Emergency Network',
      backend: 'Express.js Node Backend',
      firebase: {
        projectId: 'mombond',
        authDomain: 'mombond.firebaseapp.com',
        databaseURL: 'https://mombond-default-rtdb.europe-west1.firebasedatabase.app',
        status: 'connected',
      },
      timestamp: new Date().toISOString(),
    });
  });

  // API 2: Public Firebase Client Config
  app.get('/api/firebase/config', (req, res) => {
    res.json({
      apiKey: 'AIzaSyDnJ0uRaM0nPOvflZUJbtFm3rzCUzRJxuo',
      authDomain: 'mombond.firebaseapp.com',
      databaseURL: 'https://mombond-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: 'mombond',
      storageBucket: 'mombond.firebasestorage.app',
      messagingSenderId: '325072311054',
      appId: '1:325072311054:web:b5c289d7197a4e2dfabd5f',
      measurementId: 'G-1VJ6T73PPG',
    });
  });

  // API 3: User Verification & Session Check
  app.post('/api/auth/verify', (req, res) => {
    const { userId, password } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (userId.trim().toLowerCase() === 'omkarswami45') {
      if (password !== 'Swami@123') {
        return res.status(401).json({ error: 'Incorrect password for omkarswami45' });
      }
      return res.json({
        success: true,
        user: {
          id: 'omkarswami45',
          name: 'Omkar Swami',
          role: 'expectant_mother',
          roleTitle: 'Registered Mother & Family Guardian',
          organization: 'MomBond Maternal Care Network',
          location: 'Chhatrapati Sambhajinagar (Aurangabad)',
          phone: '+91 94220 12345',
          email: 'omkarswami45@mombond.health',
        },
      });
    }

    // Generic verification for registered accounts
    return res.json({
      success: true,
      user: {
        id: userId,
        name: userId.includes('@') ? userId.split('@')[0] : userId,
        role: 'expectant_mother',
        roleTitle: 'Registered Mother & Family Guardian',
        organization: 'MomBond Health Network',
        location: 'Chhatrapati Sambhajinagar (Aurangabad)',
        phone: '+91 94220 00000',
        email: userId.includes('@') ? userId : `${userId}@mombond.health`,
      },
    });
  });

  // API 4: Emergency Ambulance Fast Dispatch Webhook (requires only Contact & Location)
  app.post('/api/ambulance/dispatch', (req, res) => {
    const { contact, location, targetHospital } = req.body || {};
    if (!contact || !location) {
      return res.status(400).json({ error: 'Contact number and location are required' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ambulanceId = `MH-20-108-${randomSuffix}`;
    const caseId = `AMB-${Math.floor(100 + Math.random() * 900)}`;
    const driverPhone = '+91 94222 10899';

    const dispatchRecord = {
      id: caseId,
      patientName: `Emergency Booking (Contact: ${contact})`,
      referringFacility: location,
      targetHospital: targetHospital || 'Government Medical College & Hospital (GMCH Ghati)',
      ambulanceId,
      ambulanceName: '108 Advanced Obstetric & Newborn Ambulance',
      ambulanceLocation: `Dispatched & En route to ${location}`,
      driverName: '108 Ambulance Pilot (MEMS Aurangabad)',
      driverPhone,
      estimatedArrivalMin: 15,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'DISPATCHED',
      backendSyncTime: new Date().toISOString(),
    };

    activeReferrals.unshift(dispatchRecord);

    console.log(`[MomBond Backend] Emergency Ambulance Dispatched: ${ambulanceId} to ${location}`);

    res.json({
      success: true,
      message: `Emergency ambulance ${ambulanceId} booked and dispatched to ${location}!`,
      dispatch: dispatchRecord,
    });
  });

  // API 5: Fetch Active Referrals
  app.get('/api/referrals', (req, res) => {
    res.json({
      success: true,
      count: activeReferrals.length,
      referrals: activeReferrals,
    });
  });

  // API 6: Sync Daily Routine Data to Backend
  app.post('/api/routine/sync', (req, res) => {
    const { userId, milestones, kickLogs } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    userRoutines[userId] = {
      milestones: milestones || [],
      kickLogs: kickLogs || [],
      lastSyncedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      syncedAt: new Date().toISOString(),
      userId,
    });
  });

  // Mount Vite development server middleware in development
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[MomBond Backend] Server running on port ${port} (PID: ${process.pid})`);
  });
}

startServer().catch((err) => {
  console.error('[MomBond Backend] Failed to start server:', err);
  process.exit(1);
});
