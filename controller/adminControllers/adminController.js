//Requiring Nessesery Modules
const userData    = require  ('../../model/userModel')
const orderDB     = require  ('../../model/orderModel')
const productDB   = require  ('../../model/productModel')
const CategoryDB  = require  ('../../model/catogoryModel')
const moment      = require  ('moment') 
const PDFDocument = require  ('pdfkit');
require('dotenv').config()


const loadLogin = async (req,res,next) => {

        try {
                    
            res.render('login')

        } catch (error) {
            next(error)
        }
}

//TO GET START AND END DATE FUNCTION 

const getTimeRange=(period) => {

    const now=new Date();
    let startDay;
    switch(period) {
        case 'weekly':
            startDay=new Date(now.setDate(now.getDate()-7));
            break;
        case 'monthly':
            startDay=new Date(now.setMonth(now.getMonth()-1));
            break;
        case 'yearly':
            startDay=new Date(now.setFullYear(now.getFullYear()-1));
            break;
        default:
            startDay=new Date(now.setDate(now.getDate()-7));
    }
    return {startDay,endDay: new Date()};
};


//LOAD DASHBOARD

const loadHome=async (req,res,next) => {

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


        //ORDER COUNT BY BRAND
        const brandInfo = await orderDB.aggregate([
                {
                    $unwind: "$orderItems"
                },
                {
                    $lookup:{
                        from:'variants',
                        localField:'orderItems.product',
                        foreignField:"_id",
                        as:"productDetails"
                    }
                },
                {
                    $unwind:'$productDetails'
                },
                {
                    $group:{
                        _id:"$productDetails.brandName",
                        count:{$sum:1}
                    }
                },
                {
                    $project: {
                        _id:0,
                        brand: "$_id",
                        count :1
                    }
                }
        ]);

        //REVERSE THE ARRAY IN DESENDING ORDER
        const sortedBrandInfo = brandInfo.sort((a,b)=>b.count-a.count).slice(0,6)
        const brandLabel = sortedBrandInfo.map(item => item.brand);
        const brandCount = sortedBrandInfo.map(item => item.count)

        
        

        //ORDER COUNT BY PRODUCT
        const period = req.query.period || 'yearly'        
        const {startDay,endDay}=getTimeRange(period);    

        const productCount=await orderDB.aggregate([
            {
                $match: {
                    orderDate: {
                        $gte: startDay,
                        $lt: endDay
                    }
                }
            },
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

        res.render('home',{ labels,counts,catLabel,catCount,
                            proLabel,proCount,totalOrder,customers,                           
                            product,category, brandLabel,brandCount });
                          

    } catch(error) {
        next(error)
    }
}


const verifyLogin = async (req,res,next) => {


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
            next(error)
        }
}


const logOut = async(req,res,next) => {

    try {
       
        delete req.session.admin_id;
        res.redirect('/admin')
       
    } catch (error) {
        next(error)
    }
}

const showUsers = async (req,res,next) => {

    try {
       

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
        next(error)
    }
}

const blockUser = async (req,res,next) => {
   
    try {
        const userID = req.query.id
        const userDetails = await userData.updateOne({_id:userID},{$set:{isBlocked:true}});

        if(userDetails){

            delete req.session.login_id
            res.redirect('/admin/userList')
        } else{
           
            res.redirect('/admin/userlist')
        }
        
    } catch (error) {
        next(error)
    }
}

const unblockUser = async (req,res,next) => {
     try {
        const userID = req.query.id
        const unblockUser = await userData.updateOne({_id:userID},{$set:{isBlocked:false}})
        if(unblockUser){
            res.redirect('userlist')
        }else{
            res.redirect('/userlist')
        }
      } catch (error) {
         next(error)
     }
}


    //LOAD SALES REPORT

    const filterSalesReport = async (req,res,next) => {

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

            next(error)
         }
    
    }


// Route to download sales report as PDF

    const downloadPdf = async (req,res,next) =>{
        try {
            const filter=req.query.filter;
            const orderInfo=await getFilteredSalesReport(req.query);

            const doc=new PDFDocument({margin: 20,size: 'A2'}); // Set size to 'A2' for more width

            res.setHeader('Content-Type','application/pdf');
            res.setHeader('Content-Disposition','attachment; filename=sales_report.pdf');
            doc.pipe(res);

            doc.fontSize(20).text('DigiCart Ecom Sales Report',{align: 'center'});
            doc.fontSize(14).text('Custom Sales Report ',{align: 'center'});
            doc.moveDown();
          

            const tableHeaders=['Order ID','Order Date','Product','Customer','Payment Mode','Status','Offer Discount','Coupon Discount','Final Cart Price'];
            const tableWidths=[130,100,200,150,100,100,120,120,100]; // Adjust column widths

            doc.fontSize(12);

            const drawTableRow=(row,y,cellHeight) => {

                let x=doc.page.margins.left;
                row.forEach((cell,i) => {
                    doc.rect(x,y,tableWidths[i],cellHeight).stroke();
                    doc.text(cell,x+2,y+2,{width: tableWidths[i]-4,height: cellHeight-4});
                    x+=tableWidths[i];
                });
            };

            const cellHeight=30; // Increase row height
            let y=doc.y;

            drawTableRow(tableHeaders,y,cellHeight);
            y+=cellHeight;

            orderInfo.forEach(order => {
                order.orderItems.forEach(item => {

                    if(['Delivered','Completed','Return Rejected'].includes(item.orderStatus)) {

                        const row=[

                            order._id.toString(),
                            new Date(order.orderDate).toLocaleDateString(),
                            item.product.productID.name,
                            order.userId.email,
                            order.paymentMethod,
                            item.orderStatus,
                            order.offerDiscount.toString(),
                            (order.couponDetails&&order.couponDetails.claimedAmount)? order.couponDetails.claimedAmount.toString():'0',
                            order.grandTotal.toString()
                        ];

                        if(y+cellHeight>doc.page.height-doc.page.margins.bottom) {

                            doc.addPage();
                            y=doc.page.margins.top;
                            drawTableRow(tableHeaders,y,cellHeight);
                            y+=cellHeight;
                        }

                        drawTableRow(row,y,cellHeight);
                        y+=cellHeight;
                    }
                });
            });

            doc.end();

        } catch(error) {
            next(error)
        }
    
    }


// Function to get the filtered sales report data
async function getFilteredSalesReport(query) {

    const filter=query.filter;
    let dateFilter={};
    const today=new Date();

    if(filter==='day') {

        dateFilter={$gte: new Date(today.setHours(0,0,0,0)),$lt: new Date(today.setHours(23,59,59,999))};

    } else if(filter==='week') {

        const firstDayOfWeek=new Date(today.setDate(today.getDate()-today.getDay()));
        dateFilter={$gte: firstDayOfWeek,$lt: new Date(firstDayOfWeek.getTime()+7*24*60*60*1000)};

    } else if(filter==='year') {

        const firstDayOfYear=new Date(today.getFullYear(),0,1);
        dateFilter={$gte: firstDayOfYear,$lt: new Date(firstDayOfYear.getFullYear()+1,0,1)};
        
    } else if(filter==='custom') {

        const date=query.date;
        const [startDate,endDate]=date.split(' to ').map(dates => {
            const [day,month,year]=dates.split('-').map(Number);
            return new Date(year,month-1,day);
        });
        dateFilter={$gte: startDate,$lt: new Date(endDate.setHours(23,59,59,999))};
    }

    const statusFilter=['Delivered','Completed','Return Rejected'];

    const queryObject={
        ...dateFilter&&{orderDate: dateFilter},
        'orderItems.orderStatus': {$in: statusFilter}
    };

    const orderInfo=await orderDB.find(queryObject)
        .populate('userId')
        .populate({

            path: 'orderItems.product',
            model: 'Variant',
            select: ('-stock -ram -phoneMemory -block -size'),
            populate: {
                path: 'productID',
                model: 'Product',
                select: ('-description -brand -Blocked')
            }
        })
        .sort({createdAt: -1});

    return orderInfo;
}







module.exports = {
    loadLogin,
    verifyLogin,
    loadHome,
    logOut,
    showUsers,
    blockUser,
    unblockUser,
    filterSalesReport,
    downloadPdf
}