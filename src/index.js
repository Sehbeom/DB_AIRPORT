import express from "express";
import logger from "morgan";
import path from "path";

import adminRouter from '../routes/admin'; 
import userRouter from '../routes/user'; 
import homeRouter from '../routes/home';

//Port 번호 3000으로 설정
//-> localhost:3000 으로 접속
const PORT = 3000; 
const app = express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs')

app.use(logger("dev"));

app.use('/', homeRouter);
app.use('/admin', adminRouter); // '/' 경로에 대한 행동 : routes/home.js 파일에서 정의
app.use('/user', userRouter); // '/' 경로에 대한 행동 : routes/home.js 파일에서 정의

// app.use('/update', updateRouter); // '/update' 경로에 대한 행동 : routes/update.js 파일에서 정의
// app.use('/select', selectRouter); // '/select' 경로에 대한 행동 : routes/select.js 파일에서 정의

app.listen(PORT, () => {
      console.log(`Example app listening at http://localhost:${PORT}`)
  })