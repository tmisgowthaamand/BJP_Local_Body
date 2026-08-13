const dns = require('dns');

console.log('Testing DNS SRV lookup for cluster0.bjp.mongodb.net...');

dns.resolveSrv('_mongodb._tcp.cluster0.bjp.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV lookup error:', err.code, err.message);
    console.log('Testing standard A record lookup for cluster0.bjp.mongodb.net...');
    dns.resolve4('cluster0.bjp.mongodb.net', (err2, addresses2) => {
      if (err2) {
        console.error('A record lookup error:', err2.code, err2.message);
      } else {
        console.log('A records found:', addresses2);
      }
    });
  } else {
    console.log('SRV Addresses found:', addresses);
  }
});
