import express from "express";
import { insertSql, selectSql } from "../database/sql";

const router = express.Router();
const url = require('url'); 

router.get('/', async function (req, res) {
    res.render('home', {
    });
});

router.post('/', async function (req, res) {
    const vars = req.body; 
    const users = await selectSql.getUsers(); 
    let whoAmI = ''; 
    let checkLogin = false; 
    let user_number=0;

    users.map((user) => { 
        console.log(user.user_id);
        if (vars.user_id === user.user_id && vars.user_password === user.user_password) { 
            console.log('login success!');
            checkLogin = true; //조건문을 통과하면 checkLogin 변수 true로 변경.
            user_number=user.user_number;
            if (vars.user_id === 'admin') { //입력된 id가 'admin'인지 판별
                whoAmI = 'admin'; //입력된 id가 'admin'일 경우, whoAmI 변수를 'admin'으로 설정
            }
            else {
                whoAmI = 'user'; //입력된 id가 'admin'이 아닐 경우, whoAmI 변수를 'user'로 설정
            }
        }
    })

    if (checkLogin && whoAmI === 'admin') {
        res.redirect('/admin/airport_info');
    }
    else if (checkLogin && whoAmI === 'user') {
        res.redirect(url.format({
            pathname:"/user/myres",
            query: {
               user_number:user_number,
             }
          }))
    }
    else {
        console.log('login failed!');
        res.send("<script>alert('로그인에 실패했습니다.'); location.href='/';</script>");
    }
});


module.exports = router;