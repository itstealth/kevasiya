module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
  name: 'strapi::cors',
  config: {
    enabled: true,
    origin: ['https://kevasiya.com', 'http://localhost:3000'],
    credentials: true,
    headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  }
},
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
