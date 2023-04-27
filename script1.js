// ------------------------------------create DB and Table-------------------

let db=openDatabase('MyExpenses',1.0,'StoreDailyExpenses',2*1024*1024);
// let db=openDatabase('MyExpenses',1.0,'StoreDailyExpenses',2*1024*1024,dbCreated());
function dbCreated(){
    alert('DB created successfully');
}
db.transaction(function (tx){
    tx.executeSql('CREATE TABLE IF NOT EXISTS Expenses (Summary text,Description text,Price integer,Type text,Date text)');

});

// ------------------------------------Home page-------------------

// executeSql()	(sqlStatement, args, callback, errorCallback) => void
function readExpenses(){
    db.transaction(function (tx) {    
        tx.executeSql('SELECT rowid,* FROM Expenses', [], function (tx, results) {    
            let len = results.rows.length;    
            let str = '';    
            for (let i = 0; i < len; i++) {   
                let id=results.rows.item(i).rowid; 
                if(i%2==0){
                    str += `<tr class='odd-row' id=${id}>`;    
                }
                else{
                    str += `<tr class='even-row' id=${id}>`;    
                }
                let sum=results.rows.item(i).Summary;
                let desc=results.rows.item(i).Description;
                let price=results.rows.item(i).Price;
                let type=results.rows.item(i).Type;
                let date=results.rows.item(i).Date;

                str += "<td>" + id + "</td>";    
                str += "<td>" + sum + "</td>";    
                str += "<td>" + desc + "</td>";
                str += "<td>Rs." + price + "</td>";    
                str += "<td>" + type + "</td>";    
                str += "<td>" + date + "</td>";
                str += `<td><button class='h-update' onclick='storeID(${id})'>Update</button>`;
                // str += `<td><button class='h-update' onclick='getPreviousValues(${sum,desc,price,type,date})'>Update</button>`;
                
                // str += `<td><a href='UpdateExpense.html'><button class='h-update' onclick='getPreviousValues(${sum,desc,price,type,date})'>Update</button></a>`;
                str += `<button class='h-delete' onclick='deleteExpense(${id})'>Delete</button></td>`; 
                str += "</tr>";    
                document.getElementById("home-table").innerHTML += str;    
                str = '';    
            }    
        },function(){
            // alert('could not load');
        });    
    });    
}

//-------------------------------------------update page--------------------------
function storeID(id){
    localStorage.setItem("UpdateID",id);
    window.location.href="UpdateExpense.html";
}
//-----------------------------------
function getPrevValues(){
    let id=localStorage.getItem("UpdateID");
    let usum,udesc,uprice,utype,udate;

    db.transaction(function(tx){
        tx.executeSql('select * from Expenses where rowid=?',[id],function(tx,reslt){
            usum=reslt.rows.item(0).Summary;
            udesc=reslt.rows.item(0).Description;
            uprice=reslt.rows.item(0).Price;
            utype=reslt.rows.item(0).Type;
            udate=reslt.rows.item(0).Date;
            // alert(usum+" "+udesc+" "+uprice+" "+utype+" "+udate);
            document.getElementById('u-summary').value=usum;
            document.getElementById('u-description').value=udesc;
            document.getElementById('u-price').value=uprice;
            document.getElementById('u-type').value=utype;
            document.getElementById('u-date').value=udate;

        },function(){
            // alert('error in execute')
        });
    },function(){
        // alert('errorcall');
    },function(){
        // alert('successcall')
    });
}
//---------------------------------------
function updateExpense(){

    let id=localStorage.getItem("UpdateID");
    let sum=document.getElementById('u-summary').value;
    let desc=document.getElementById('u-description').value;
    let price=document.getElementById('u-price').value;
    let type=document.getElementById('u-type').value;
    let time=document.getElementById('u-date').value;
    type=(type[0].toUpperCase())+type.slice(1);

    db.transaction(function (tx){
        tx.executeSql('update Expenses set Summary=?,Description=?,Price=?,Type=?,Date=? where rowid=?',[sum,desc,price,type,time,id]
        );                        //update row
    }, function (error){
        error="Please Enter correct input";          // if transaction failed
        // alert(error);
    }, function (){
        // alert('Expense Updated Successfully');         // if transaction succeed
    });
    alert('Expense Updated Successfully');
}

//-------------------------------------------delete expense--------------------------
function deleteExpense(id){
            // console.log(id);
            // let result = confirm("Are you sure you want to delete this Expense?");
            // if (result) {
                db.transaction(function(tx) {
                    tx.executeSql('delete from Expenses where rowid=?', [id], function(transaction, result) {
                        alert('Expense Deleted Successfully');
                        document.getElementById(`${id}`).remove();
                        //window.location.reload();                   //reload window  
    
                    }, function(error) {
                        error='could not delete';
                        // alert(error);
                    });
                });
            // }
}

// ------------------------------------add new expense page-------------------
function insertExpense() {
    let sum=document.getElementById('summary').value;
    let desc=document.getElementById('description').value;
    let price=document.getElementById('price').value;
    let type=document.getElementById('type').value;
    let time=document.getElementById('date').value;
    type=(type[0].toUpperCase())+type.slice(1);

    // transaction()	(callback, errorCallback, successCallback) => void
    let query=`insert into Expenses(Summary,description,Price,Type,Date) values("${sum}","${desc}","${price}","${type}","${time}")`;
    
    db.transaction(function (tx){
        tx.executeSql(query);                        //insert row
    }, function (error){
        error="Please Enter correct input";          // if transaction failed
        // alert(error);
    }, function (){
        // alert('Expense Added Successfully');         // if transaction succeed
    });
    alert('Expense Added Successfully');
}
//-------------------------display date -----------
function displayDate() {
    let d=new Date();
    let day=d.getDay();
    let dd="";
    if(day===0){
        dd='Sunday';
    }
    else if(day===1){
        dd='Monday';
    }
    else if(day===2){
        dd='Tuesday';
    }
    else if(day===3){
        dd='Wednesday';
    }
    else if(day===4){
        dd='Thursday';
    }
    else if(day===5){
        dd='Friday';
    }
    else if(day===6){
        dd='Saturday';
    }
    let dateTime =  (d.getMonth()+1) + "/"
            + d.getDate()  + "/" 
            + d.getFullYear() + " "  
            + dd + " "
            + d.getHours() + ":"  
            + d.getMinutes() + ":" 
            + d.getSeconds();
    document.getElementById('date').value=dateTime;
}

// ------------------------------------filter expense-------------------
function getExpenseTypes(){
    // document.getElementById('filter-table').style.display='none';

    db.transaction(function(tx){
        tx.executeSql('select distinct type from expenses',[],function(tx,result1){
            let len1=result1.rows.length;
            // console.log(len1);
            let option="<option>Choose Type</option>";
            for(let i=0; i<len1; i++){
                option += "<option>" + result1.rows.item(i).Type + "</option>";
            }
            document.getElementById('types-option').innerHTML = option;
        });
    });
}
// ------------------------------------show filtered expense (table)-------------------
function showFilteredExpenses(){

    let type=document.getElementById('types-option').value;
    let min=document.getElementById('min').value;
    let max=document.getElementById('max').value;
    // console.log(type);
    // console.log(min);
    // console.log(max);

    let query;
    let pquery='';
    if((type==="Choose Type") && ( (min==='' && max==='') || (min!='' && max==='') || (max!='' && min==='') )){
        alert('please complete at least one field');
    }
    else {
        pquery=query;
        if(type!="Choose Type" && min!='' && max!=''){
            //filter by both type and range
            query=`SELECT rowid,* FROM Expenses where Type="${type}" and Price BETWEEN "${min}" and "${max}"`;
        }
        else if(type!="Choose Type"){
            query=`select rowid,* from Expenses where Type="${type}"`;
        }
        else{
            query=`select rowid,* from Expenses where Price BETWEEN ${min} and ${max}`;
        }
        document.getElementById('filter-table').style.display="block";   
        document.getElementById('filter-table').style.width='fit-content';   

        let head="<table class='expense-table' id='filter-table'>";
            head += "<tr><th id='f-sr'>Sr.</th>"
            head += "<th id='f-summ'>Expense Summary.</th>"
            head += "<th id='f-desc'>Description.</th>"
            head += "<th id='f-price'>Price</th>"
            head += "<th id='f-type'>Type</th>"
            head += "<th id='f-date'>Date</th></tr></table>";
        db.transaction(function (tx) {    
            tx.executeSql(query, [], function (tx, results) {    
                let len = results.rows.length;    
                let str = head;
                for (let i = 0; i < len; i++) {   
                    // let id=results.rows.item(i).rowid; 
                    if(i%2==0){
                        str += "<tr class='odd-row'>";    
                    }
                    else{
                        str += "<tr class='even-row'>";    
                    }
                    str += "<td>" + results.rows.item(i).rowid + "</td>";    
                    str += "<td>" + results.rows.item(i).Summary + "</td>";    
                    str += "<td>" + results.rows.item(i).Description + "</td>";
                    str += "<td>Rs." + results.rows.item(i).Price + "</td>";    
                    str += "<td>" + results.rows.item(i).Type + "</td>";    
                    str += "<td>" + results.rows.item(i).Date + "</td>";
                    
                }
                document.getElementById("filter-table").innerHTML = str;    
            },function(){
                alert('could not load');
            });    
        }); 
    }
}
// ------------------------------------Graph Summary-------------------
function loadOptions(){
    //--------------selecting current month----------
    let mon=new Date().getMonth()+1;
    let max=new Date().getFullYear();                         //taking current date

    //---------adding years from current year to latest year in database------
    db.transaction(function(tx){
        tx.executeSql('select distinct min(date) as mind from expenses',[],function(tx,res1){
            let len1=res1.rows.length;
            let min=res1.rows.item(0).mind;
            let str='<option value="Select Year">Select Year</option>';
            // console.log(min)
            // console.log(len1)
            
            if(min!=null){
                min = res1.rows.item(0).mind;
                let inde = min.indexOf(' ');
                min=min.slice(inde-4,inde);
                // console.log(min)

                for(let i=max; i>=min; i--){          //adding options accrding to data in database
                    str += `<option value=${i}>` +i+'</option>';
                }
            }
            else{
                str += `<option value=${max} selected>` +max+'</option>';
            }
            document.getElementById('select-year').innerHTML=str;
        });
    });
    e();
}

//-----------------chart library added
    // var js=document.createElement('script');
    // js.src  = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js';
    // document.getElementsByTagName('head').item(0).appendChild(js);
    // e()
   
function e()
{
    document.querySelector("#chart-div").innerHTML = '<canvas id="myChart"></canvas>';

    var xValues=[];
    var yValues=[];
    var barColors = ["red", "green","blue","orange","brown","pink","purple","yellow"];
    var ty='';

    let month=document.getElementById('select-month').value;
    let year=document.getElementById('select-year').value;

    // let year=document.getElementById('select-year').value;
    // console.log(month+" "+year)

    let query1,query2;
    let d;

    if(month==='Select Month' && year==='Select Year'){
        // alert('please select month OR year')
        query1='select distinct type from expenses order by Type';
        query2='select total(price) AS sp from expenses group by Type';
        db.transaction(function(tx){               
            tx.executeSql(query1,[],function(tx,resul1){
                let len1=resul1.rows.length;
                for(let i=0; i<len1; i++){
                    ty=resul1.rows.item(i).Type;
                    xValues.push(ty);
                }
                var ch=new Chart("myChart", {                          //adding x values
                    type: "bar",
                    data: {
                        labels: xValues,
                        datasets: [{
                           backgroundColor: barColors,
                            data: yValues,
                        }]
                    },
                    options: {
                        legend: {display: false},
                        title: {
                            display: true,
                            text: "Expense Summaries"
                        }
                    }
                });
            }, function () {
                console.log('exe')
            });
        });
        db.transaction(function(tx){               
            tx.executeSql(query2,[],function(tx,resul1){
                let len1=resul1.rows.length;
                // console.log(len1)
                for(let i=0; i<len1; i++){
                    yValues.push(resul1.rows.item(i).sp);
                }
                var ch=new Chart("myChart", {                          //adding y values
                    type: "bar",
                    data: {
                        labels: xValues,
                        datasets: [{
                           backgroundColor: barColors,
                            data: yValues,
                        }]
                    },
                    options: {
                        legend: {display: false},
                        title: {
                            display: true,
                            text: "Expense Summaries"
                        }
                    }
                });
            });
        });
    }

    else{
        if(month==='Select Month' && year!='Select Year'){
            console.log('year')
            d='%'+year+'%';
        }
        else if(month!='Select Month' && year==='Select Year'){
            console.log('month')
            d=month+'%';
        }
        else{
            console.log('both')
            d=month+'%'+year+'%';
        }
        query1=`select distinct type from (select * from expenses where date like ?) order by Type`;
        query2=`select total(price) AS sp from (select * from expenses where date like ?) group by Type`;
    
    db.transaction(function(tx){               
        tx.executeSql(query1,[d],function(tx,resul1){
            let len1=resul1.rows.length;
            for(let i=0; i<len1; i++){
                ty=resul1.rows.item(i).Type;
                xValues.push(ty);
            }
            var ch=new Chart("myChart", {                          //adding x values
                type: "bar",
                data: {
                    labels: xValues,
                    datasets: [{
                       backgroundColor: barColors,
                        data: yValues,
                    }]
                },
                options: {
                    legend: {display: false},
                    title: {
                        display: true,
                        text: "Expense Summaries"
                    }
                }
            });
            
        }, function () {
            console.log('exe')
        });
    });
    db.transaction(function(tx){               
        tx.executeSql(query2,[d],function(tx,resul1){
            let len1=resul1.rows.length;
            // console.log(len1)
            for(let i=0; i<len1; i++){
                yValues.push(resul1.rows.item(i).sp);
            }
            var ch=new Chart("myChart", {                          //adding y values
                type: "bar",
                data: {
                    labels: xValues,
                    datasets: [{
                       backgroundColor: barColors,
                        data: yValues,
                    }]
                },
                options: {
                    legend: {display: false},
                    title: {
                        display: true,
                        text: "Expense Summaries"
                    }
                }
            });
        });
    });
}
}
