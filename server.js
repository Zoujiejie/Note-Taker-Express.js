const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// App listener
app.listen(PORT, () => {
  console.log(`Server available at localhost${PORT}`);
});

