import ngrok from 'ngrok';

let callbackUrl = null;

export async function initNgrok(req, res, next) {
  try {
   
    if (!callbackUrl) {
      callbackUrl = await ngrok.connect({
        addr: process.env.PORT || 3000,
        authtoken: process.env.NGROK_AUTHTOKEN,
      });
    }

   
    req.callbackUrl = callbackUrl;
    next();
  } catch (error) {
    console.error('Ngrok Middleware Error:', error.message);
    res.status(500).json({ error: 'Failed to initialize Ngrok tunnel (check on your internet connection)' });
  }
}
