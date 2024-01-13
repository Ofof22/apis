
function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let result = '';
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  }
  

  module.exports = (app) => {
    app.get('/api/cath', (req, res) => {
      const data = {
        timestamp: new Date().toISOString(),
        randomCode: generateRandomCode(10), // Uzunluk 10 olarak ayarlanabilir
      };
      res.json(data);
    });
  };
  