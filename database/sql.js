import async from "hbs/lib/async";
import mysql from "mysql2"; 

//데이터베이스 연결
const pool = mysql.createPool( //createPool() 함수를 통한 mysql 연결 설정
    process.env.JAWSDB_URL ?? {
        host: 'localhost', //host를 localhost로 설정 -> 웹 브라우저 상에서 localhost를 통해 접속 가능
        user: 'root', //mysql의 root로 연결
        database: 'airport', //week8 database 연결
        password: 'wldnjs12', // mysql password
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
);

// async/await 사용
const promisePool = pool.promise();

// select query
export const selectSql = { //selectSql object 정의 : select 명령어 관련 기능 수행
    getUsers : async () =>{
        const [rows] = await promisePool.query(`select * from user`); 
        console.log(rows)
        return rows
    },
    getMyRes: async (data) =>{
        const [rows] = await promisePool.query(`
        select sr.seat_number, sr.user_number, fs.sch_number, airline, a.name departure, time_format(scheduled_departure_time,'%h:%i') depart_time, b.name arrival, time_format(scheduled_arrival_time,'%h:%i') arrive_time, l.date date_info, date_format(l.date,'%Y-%m-%d') date_string, airplane_id 
        from airport a, airport b, flight f, flight_leg fl, leg_instance l, flight_sch fs, seat_reservation sr 
        where sr.user_number=${data} and sr.sch_number=l.sch_number and sr.date=l.date and l.sch_number=fs.sch_number and fs.flight_number=f.flight_number and fs.leg_number=fl.leg_number and fl.departure_airport_code=a.airport_code and fl.arrival_airport_code=b.airport_code
        order by l.date;
        `); 
        console.log(rows)
        return rows
    },
    getAirport : async () =>{
        const [rows] = await promisePool.query(`select * from airport`); 
        console.log(rows)
        return rows
    },
    getAirplane : async () =>{
        const [rows] = await promisePool.query(`select * from airplane`); 
        console.log(rows)
        return rows
    },
    getLeg : async () =>{
        const [rows] = await promisePool.query(`
        select fs.sch_number, airline, a.name departure, time_format(scheduled_departure_time,'%h:%i') depart_time, b.name arrival, time_format(scheduled_arrival_time,'%h:%i') arrive_time, date date_info, date_format(date,'%Y-%m-%d') date_string, number_of_available_seats seats, airplane_id 
        from airport a, airport b, flight f, flight_leg fl, leg_instance l, flight_sch fs 
        where l.sch_number=fs.sch_number and fs.flight_number=f.flight_number and fs.leg_number=fl.leg_number and fl.departure_airport_code=a.airport_code and fl.arrival_airport_code=b.airport_code
        order by date;`); 
        console.log(rows)
        return rows
    },
    getSchinfo : async () =>{
        const [rows] = await promisePool.query(`
        select fs.sch_number, f.airline s_airline, a.name s_departure, scheduled_departure_time s_depart_time, b.name s_arrival, scheduled_arrival_time s_arrive_time
        from airport a, airport b, flight f, flight_leg fl, flight_sch fs
        where fs.flight_number=f.flight_number and fs.leg_number=fl.leg_number 
            and fl.departure_airport_code=a.airport_code and fl.arrival_airport_code=b.airport_code;`); 
        console.log(rows)
        return rows
    },
    getAirplaneID : async () =>{
        const [rows] = await promisePool.query(`select airplane_id a_id from airplane;`); 
        console.log(rows)
        return rows
    },
    getSCH_Leg : async (data) =>{
        const [rows] = await promisePool.query(`
        select fs.sch_number, f.airline airline, a.name departure, scheduled_departure_time depart_time, b.name arrival, scheduled_arrival_time arrive_time
        from airport a, airport b, flight f, flight_leg fl, flight_sch fs
        where fs.sch_number=${data.sch_number} and fs.flight_number=f.flight_number and fs.leg_number=fl.leg_number 
            and fl.departure_airport_code=a.airport_code and fl.arrival_airport_code=b.airport_code;`); 
        console.log(rows)
        return rows
    },
}

export const deleteSql = { 
    deleteAirport : async(data)=>{
        const sql = `delete from airport where airport_code=${data.airport_code}`;

        await promisePool.query(sql);
    },
    deleteAirplane : async(data)=>{
        const sql = `delete from airplane where airplane_id=${data.airplane_id}`;

        await promisePool.query(sql);
    },
    deleteLegIns : async(data)=>{
        const sql = `delete from leg_instance where sch_number=${data.sch_number} and date='${data.date}'`;

        await promisePool.query(sql);
    },
}

export const updateSql = { 
    updateAirport : async(data)=>{
        // console.log('deleteSql.deleteDepartment: ',data.Dnumber);
        const sql = `update airport set name='${data.name}', city='${data.city}', state='${data.state}' 
        where airport_code=${data.airport_code};`;

        await promisePool.query(sql);
    },
    updateAirplane : async(data)=>{
        // console.log('deleteSql.deleteDepartment: ',data.Dnumber);
        const sql = `update airplane set total_number_of_seats='${data.seats}', airplane_type='${data.type}' where airplane_id=${data.airplane_id};`;

        await promisePool.query(sql);
    },
    updateLegIns : async(data)=>{
        // console.log('deleteSql.deleteDepartment: ',data.Dnumber);
        const sql = `update leg_instance set number_of_available_seats='${data.seats}' where sch_number=${data.sch_number} and date='${data.date}';`;

        await promisePool.query(sql);
    },
}

// insert query
export const insertSql = { //insertSql object 정의 : insert 명령어 관련 기능 수행
    setAirport : async (data) => { 
        const sql = `insert into airport values(${data.airport_code}, '${data.name}', '${data.city}', '${data.state}');`;
        
        //query() 함수의 인자로 sql 전달 : 사용자로부터 입력된 데이터 값을 employee table에 insert.
        await promisePool.query(sql);
    },
    setAirplane : async (data) => { //employee table에 Data를 insert 하는 함수. 인자로 입력된 데이터를 받아옴(data)
        //sql 변수에 사용자로부터 입력된 데이터 값을 employee table에 insert 하는 명령어 저장
        const sql = `insert into airplane values(${data.airplane_id}, '${data.seats}', '${data.type}');`;
        
        //query() 함수의 인자로 sql 전달 : 사용자로부터 입력된 데이터 값을 employee table에 insert.
        await promisePool.query(sql);
    },
    setLegIns : async (data) => { //employee table에 Data를 insert 하는 함수. 인자로 입력된 데이터를 받아옴(data)
        //sql 변수에 사용자로부터 입력된 데이터 값을 employee table에 insert 하는 명령어 저장
        const sql = `insert into leg_instance values(${data.sch_number}, '${data.date}', '${data.seats}', '${data.airplane_id}');`;
        
        //query() 함수의 인자로 sql 전달 : 사용자로부터 입력된 데이터 값을 employee table에 insert.
        await promisePool.query(sql);
    },
}

// // update query
// export const updateSql = { //updateSql object 정의 : update 명령어 관련 기능 수행
//     updateEmployee : async (data) => {
//         // where 조건을 만족하는 행에 대해서 salary 수정
//         // where 조건으로 Ssn = "data.Ssn" 설정
//         // query() 함수를 통해 명령어 전달

//         const sql = `update employee set salary = ${data.Salary} where Ssn = "${data.Ssn}"`;
//         await promisePool.query(sql);
//     },
//     updateDepartment : async (data) => {
//         // where 조건을 만족하는 행에 대해서 dname 수정
//         // where 조건으로 Dnumber = 1 설정
//         // query() 함수를 통해 명령어 전달

//         console.log("Dname!! : "+data.Dname);
//         const sql = `update department set dname = "${data.Dname}" where Dnumber = 1`;
//         await promisePool.query(sql);
//     },
// }