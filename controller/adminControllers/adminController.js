//Requiring Nessesery Modules
const userData   = require('../../model/userModel')
const orderDB    = require('../../model/orderModel')
const productDB  = require('../../model/productModel')
const CategoryDB = require('../../model/catogoryModel')
const excelJs    = require('exceljs')
const moment     = require('moment') 
require('dotenv').config()


const loadLogin = async (req,res) => {

        try {
          
            res.render('login')

        } catch (error) {
            console.log('error in adminControl loadLogin',error);
            return res.status(500).redirect('/admin/error')
        }
}

//LOAD DASHBOARD

const loadHome=async (req,res) => {

    try {
            //ORDER COUNT BY DATE
            const startDate = moment().startOf('day').subtract(4,'days');
            const endDate   = moment().endOf('day')

            const orders=await orderDB.aggregate([
                        {
                            $match: {
                                orderDate: {
                                    $gte: startDate.toDate(),
                                    $lt: endDate.toDate()
                                }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    $dateToString: {format: "%Y-%m-%d",date: "$orderDate"}
                                },
                                count: {$sum: 1}
                            }
                        },
                        {$sort: {_id: 1}}
                    ]);


            //ORDER  COUNT BY CATEGORY 
            const orderInfo=await orderDB.aggregate([
                    {
                        $unwind: "$orderItems"
                    },
                    {
                        $lookup: {
                            from: "variants",
                            localField: "orderItems.product",
                            foreignField: "_id",
                            as: "productDetails"
                        }
                    },
                    {
                        $unwind: "$productDetails"
                    },
                    {
                        $group: {
                            _id: "$productDetails.categoryName",
                            count: {$sum: 1}
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            category: "$_id",
                            count: 1
                        }
                    }
                ]);

        //REVERSE THE ARRAY IN DESENDING ORDER
        const sortedOrderInfo = orderInfo.sort((a,b)=>b.count - a.count).slice(0,6);
        const catLabel=sortedOrderInfo.map(item => item.category);
        const catCount=sortedOrderInfo.map(item => item.count);


        //ORDER COUNT BY PRODUCT
        const productCount=await orderDB.aggregate([
            {
                $unwind: "$orderItems"
            },
            {
                $lookup: {
                    from: "variants",
                    localField: "orderItems.product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $group: {
                    _id: "$productDetails.productName",
                    count: {$sum: 1}
                }
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id",
                    count: 1
                }
            }
        ]);


        const sortedProductArray = productCount.sort((a,b)=>b.count-a.count).slice(0,6)
        const proLabel=sortedProductArray.map(item => item.product);
        const proCount=sortedProductArray.map(item => item.count);
        const totalOrder = productCount.reduce((sum,current)=>sum+current.count,0)
        
            // Create an array for the last 5 days with default count 0
            const orderCounts=[];
            for(let i=4;i>=0;i--) {
                const date=moment().subtract(i,'days').format('YYYY-MM-DD');
                const order=orders.find(order => order._id===date);
                orderCounts.push(order? order.count:0);
            }

            const labels = orderCounts.map((_,i) => moment().subtract(4-i,'days').format('dddd'))
            const counts =  orderCounts;

            const customers = await userData.countDocuments()
            const product   = await productDB.countDocuments()
            const category  = await CategoryDB.countDocuments()

        res.render('home',{labels,counts,catLabel,
            catCount,proLabel,proCount,totalOrder,customers,product,category});

    } catch(error) {
        console.log(error)
        return res.status(500).redirect('/admin/error')
    }
}




const errorPage = async (req,res) => {
    try {
        res.render('../partials/505')
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}



const verifyLogin = async (req,res) => {
            const{email,password} = req.body
            const adminEmail = process.env.ADMIN_EMAIL
            const adminPass = process.env.ADMIN_PASS
          

        try {
             if(adminEmail == email && adminPass == password){
                req.session.admin_id = email;
                 res.redirect('/admin/home')

            }else{
                console.log('email and password Incorrect')
                return res.redirect('/admin/')
            }
            
        } catch (error) {
            console.log('error in adminController verifyLogin',error);
            return res.status(500).redirect('/admin/error')
        }
}


const logOut = async(req,res) => {

    try {
       
        delete req.session.admin_id;
        res.redirect('/admin')
       
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error') 
    }
}

const showUsers = async (req,res) => {

    try {
        //let users =[];
        //if(req.query.searchInput) {
        //    const searchInput=req.query.searchInput.toString()
        //    users = await userData.find({
        //             $or: [{name: {$regex: searchInput,$options: 'i'}},
        //            {email: {$regex: searchInput,$options: 'i'}}]});
                
        //}else{
        //    users = await userData.find()
        //}

        let query = {}
        const page = parseInt(req.query.page)||1
        const limit = 10
        const skip = (page-1)*limit
        
        if(req.query.searchInput) {
            const searchInput=req.query.searchInput.toString()
            query ={
                $or: [{name: {$regex: searchInput,$options: 'i'}},
                {email: {$regex: searchInput,$options: 'i'}}]
            }                     
        }

        const users = await userData.find(query)
                      .sort({createdAt:-1})
                      .skip(skip)
                      .limit(limit);

        const totalDocuments = await userData.countDocuments(query)
        const totalPages = Math.ceil(totalDocuments/limit)

        
        res.render('userList',{customers:users,currentPage:page,totalPages });
        
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}

const blockUser = async (req,res) => {
   
    try {
        const userID = req.query.id
        const userDetails = await userData.updateOne({_id:userID},{$set:{isBlocked:true}});

        if(userDetails){

            delete req.session.login_id
            res.redirect('/admin/userList')
        } else{
            console.log('User not found');
            res.redirect('/admin/userlist')
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}

const unblockUser = async (req,res) => {
     try {
        const userID = req.query.id
        const unblockUser = await userData.updateOne({_id:userID},{$set:{isBlocked:false}})
        if(unblockUser){
            res.redirect('userlist')
        }else{
            res.redirect('userlist')
        }
      } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
     }
}


    //LOAD SALES REPORT

    const filterSalesReport = async (req,res) => {

        try {

            const filter = req.query.filter;  
            
            //PAGINATION FUNCTIONS
            const page = parseInt(req.query.page)||1
            const limit = parseInt(req.query.limit) || 8
            const skip  = (page-1)*limit

            let dateFilter = {};

            const today = new Date();
            
            if (filter === 'day') {
                dateFilter = { $gte: new Date(today.setHours(0, 0, 0, 0)), $lt: new Date(today.setHours(23, 59, 59, 999)) };

            } else if (filter === 'week') {
                const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                dateFilter = { $gte: firstDayOfWeek, $lt: new Date(firstDayOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000) };

            } else if (filter === 'year') {
                const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
                dateFilter = { $gte: firstDayOfYear, $lt: new Date(firstDayOfYear.getFullYear() + 1, 0, 1) };

            } else if (filter === 'custom'){
                
                const date=req.query.date
                const [startDate,endDate]  = date.split(' to ').map(dates => {
                const [day,month,year]  =  dates.split('-').map(Number);
                return new Date(year,month-1,day);

                })

                dateFilter={$gte: startDate,$lt: new Date(endDate.setHours(23,59,59,999))};
            
            }

            const query = filter ? {orderDate : dateFilter} : {}

            // Get total number of documents matching the query
            const totalDocuments=await orderDB.countDocuments(query);

            const orderInfo = await orderDB.find(query)
                    .populate('userId')
                    .populate({
                        path: 'orderItems.product',
                        model: 'Variant',
                        select : ('-stock -ram -phoneMemory -block -size'),
                            populate: {
                                path: 'productID',
                                model: 'Product',
                                select: ('-discription -brand -Blocked')
                            }
                    }).sort({ createdAt: -1 })
                      .skip(skip)
                      .limit(limit);

                    const totalPages = Math.ceil(totalDocuments/limit)

                    res.render('salesReport',{orderInfo,totalPages,currentPage:page})

    } catch (error) {

        res.status(500).json({ error: 'Internal Server Error' });
    }
    
    }


module.exports = {
    loadLogin,
    verifyLogin,
    loadHome,
    logOut,
    showUsers,
    blockUser,
    unblockUser,
    errorPage,
    filterSalesReport
}