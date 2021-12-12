import express from "express";
import { insertSql, selectSql, updateSql, deleteSql} from "../database/sql";

const router = express.Router();


router.get('/airport_info', async function(req,res){ //'/' 경로로 get 요청이 들어왔을 경우에 대한 함수
    const airport = await selectSql.getAirport();

    // console.log(airport);
    res.render('admin/airport_info',{
        airport
    }); // home.hbs 파일 rendering을 응답으로 전달
});

router.get('/airport_info/edit', async function(req,res){ //'/' 경로로 get 요청이 들어왔을 경우에 대한 함수
    const airport = await selectSql.getAirport();

    // console.log(airport);
    res.render('admin/airport_man',{
        airport
    }); // home.hbs 파일 rendering을 응답으로 전달
});

router.post('/airport_info/edit', async function(req,res){ //'/' 경로로 get 요청이 들어왔을 경우에 대한 함수   
    if(Object.keys(req.body).includes('delBtn')){
        const data={
            airport_code: req.body.delBtn,
        };

        // 위에서 정의된 data 변수를 delete 쿼리문을 정의하는 함수 deleteDepartment의 인자로 전달함.
        await deleteSql.deleteAirport(data);
    }

    else if(Object.keys(req.body).includes('editBtn')){
        // const i=req.body.airport_code.indexOf(req.body.editBtn);
        const data={
            airport_code:req.body.editBtn,
            name:req.body.name,
            city:req.body.city,
            state:req.body.state,
        }

        await updateSql.updateAirport(data);
    }

    else if(Object.keys(req.body).includes('insertBtn')){
        const data={
            airport_code:req.body.set[0],
            name:req.body.set[1],
            city:req.body.set[2],
            state:req.body.set[3],
        }

        await insertSql.setAirport(data);
    }

    res.redirect('/admin/airport_info/edit');
});

router.get('/airplane_info', async function(req,res){ //'/' 경로로 get 요청이 들어왔을 경우에 대한 함수
    const airplane = await selectSql.getAirplane();

    // console.log(airplane);
    res.render('admin/airplane_info',{
        airplane
    }); // home.hbs 파일 rendering을 응답으로 전달
});

router.get('/airplane_info/edit', async function(req,res){ //'/' 경로로 get 요청이 들어왔을 경우에 대한 함수
    const airplane = await selectSql.getAirplane();

    // console.log(airplane);
    res.render('admin/airplane_man',{
        airplane
    }); // home.hbs 파일 rendering을 응답으로 전달
    
});

router.post('/airplane_info/edit', async function(req,res){ //'/' 경로로 get 요청이 들어왔을 경우에 대한 함수
    if(Object.keys(req.body).includes('delBtn')){
        const data={
            airplane_id: req.body.delBtn,
        };

        // 위에서 정의된 data 변수를 delete 쿼리문을 정의하는 함수 deleteDepartment의 인자로 전달함.
        await deleteSql.deleteAirplane(data);
    }

    else if(Object.keys(req.body).includes('insertBtn')){
        const data={
            airplane_id:req.body.set[0],
            seats:req.body.set[1],
            type:req.body.set[2],
        }

        await insertSql.setAirplane(data);
    }

    else if(Object.keys(req.body).includes('editBtn')){
        const data={
            airplane_id:req.body.editBtn,
            seats:req.body.seats,
            type:req.body.type,
        }

        await updateSql.updateAirplane(data);
    }

    res.redirect('/admin/airplane_info/edit');
});

router.get('/leg_info', async function(req,res){ //'/' 경로로 get 요청이 들어왔을 경우에 대한 함수
    const leg = await selectSql.getLeg();
    // console.log(leg);
    res.render('admin/leg_info',{
        leg
    }); // home.hbs 파일 rendering을 응답으로 전달
});

router.get('/leg_info/edit', async function(req,res){ //'/' 경로로 get 요청이 들어왔을 경우에 대한 함수
    const leg = await selectSql.getLeg();
    const schinfo=await selectSql.getSchinfo();
    const airplaneID=await selectSql.getAirplaneID();

    // console.log(leg);
    res.render('admin/leg_man',{
        leg,
        schinfo,
        airplaneID
    }); // home.hbs 파일 rendering을 응답으로 전달
});

router.post('/leg_info/edit', async function(req,res){ //'/' 경로로 get 요청이 들어왔을 경우에 대한 함수
    if(Object.keys(req.body).includes('delBtn')){
        console.log("delete!!0");
        console.log(req.body);
        console.log("delete!!0");
        const data={
            sch_number: req.body.delBtn,
            date:req.body.date_info
        };

        // 위에서 정의된 data 변수를 delete 쿼리문을 정의하는 함수 deleteDepartment의 인자로 전달함.
        await deleteSql.deleteLegIns(data);
    }

    else if(Object.keys(req.body).includes('insertBtn')){
        // const schNum=req.body.sch_number;
        // const sch_data=await selectSql.getSCH_Leg(schNum);
        
        // console.log("insert!!0");
        // console.log(req.body);
        // console.log("insert!!0");

        const data={
            sch_number:req.body.sch_number,
            date:req.body.date_info,
            seats:req.body.seats,
            airplane_id:req.body.airplane_id,
        }

        await insertSql.setLegIns(data);
    }

    else if(Object.keys(req.body).includes('editBtn')){
        const data={
            sch_number:req.body.editBtn,
            date:req.body.date_info,
            seats:req.body.seats,
        }

        await updateSql.updateLegIns(data);
    }

    // console.log(leg);
    res.redirect('/admin/leg_info/edit');
});

module.exports = router;