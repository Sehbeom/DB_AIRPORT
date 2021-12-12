import express from "express";
import { insertSql, selectSql} from "../database/sql";

const router = express.Router();
let user_number=0;

router.get('/leg_res', async function(req,res){ //'/' 경로로 get 요청이 들어왔을 경우에 대한 함수
    const leg = await selectSql.getLeg();
    console.log(req.query);

    console.log(leg);
    res.render('user/leg_res',{
        leg,
        user_number:user_number
    }); // home.hbs 파일 rendering을 응답으로 전달
});

router.get('/myres', async function(req,res){ //'/' 경로로 get 요청이 들어왔을 경우에 대한 함수
    const myres = await selectSql.getMyRes(req.query.user_number);
    user_number=req.query.user_number;
    console.log(myres);
    res.render('user/myres',{
        myres,
        user_number:req.query.user_number
    }); // home.hbs 파일 rendering을 응답으로 전달
});

module.exports = router;