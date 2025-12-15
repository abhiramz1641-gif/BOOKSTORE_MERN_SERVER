const books = require("../models/bookModel")

const stripe = require('stripe')(process.env.stripeKey);



exports.addBookController = async (req, res) => {


    console.log("inside add book");
    console.log(req.body);
    console.log(req.files);

    const { title, author, nop, imgUrl, price, discountPrice, abstract, publisher, language, isbn, category } = req.body

    console.log(title, author, nop, imgUrl, price, discountPrice, abstract, publisher, language, isbn, category);

    const uploadImg = []

    req.files.map(item => uploadImg.push(item.filename))

    console.log(uploadImg);

    const email = req.payload
    console.log(email);



    try {

        const existingUser = await books.findOne({ title, userMail: email })
        //console.log(existingUser);

        if (existingUser) {
            res.status(400).json({ message: "You already added this book" })
        } else {

            const newBook = new books({ title, author, nop, imgUrl, price, discountPrice, abstract, publisher, language, isbn, category, uploadImg: uploadImg, userMail: email })

            await newBook.save()

            res.status(200).json(newBook)

        }


    } catch (err) {
        res.status(500).json({ error: "Internal server error", details: err.message })
    }


}

exports.getHomeBookController = async (req, res) => {

    try {

        const homeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(homeBooks)

    } catch (err) {

        res.status(500).json(err)

    }

}

exports.getAllBooks = async (req, res) => {

    const searchKey = req.query.search
    console.log(searchKey);
    const email = req.payload

    const query = {

        title: {
            $regex: searchKey, $options: 'i'
        },
        userMail: { $ne: email }

    }


    try {

        const homeBooks = await books.find(query)
        res.status(200).json(homeBooks)

    } catch (err) {

        res.status(500).json(err)

    }

}

exports.getAllBooksByUser = async (req, res) => {

    const email = req.payload

    try {

        const allUserBooks = await books.find({ userMail: email })
        res.status(200).json(allUserBooks)

    } catch (err) {

        res.status(500).json(err)

    }

}

exports.getAllBooksBroughtByUser = async (req, res) => {

    const email = req.payload

    try {

        const allUserBroughtBooks = await books.find({ brought: email })
        res.status(200).json(allUserBroughtBooks)

    } catch (err) {

        res.status(500).json(err)

    }

}

exports.makePaymentController = async (req, res) => {

    const email = req.payload

    const { bookDetails } = req.body

    try {

        const existingBook = await books.findByIdAndUpdate({ _id: bookDetails._id },
            {
                //_id: bookDetails._id,
                title: bookDetails.title,
                author: bookDetails.author,
                nop: bookDetails.nop,
                imgUrl: bookDetails.imgUrl,
                price: bookDetails.price,
                discountPrice: bookDetails.discountPrice,
                abstract: bookDetails.abstract,
                publisher: bookDetails.publisher,
                language: bookDetails.language,
                isbn: bookDetails.isbn,
                category: bookDetails.category,
                brought: email,
                status: "sold",
                uploadImg: bookDetails.uploadImg,
                userMail: bookDetails.userMail

            }, { new: true }
        )

        const line_items = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: bookDetails.title,
                    description: `${bookDetails.author} | ${bookDetails.publisher}`,
                    images: [bookDetails.imgUrl],
                    metadata: {
                        //_id: bookDetails._id,
                        title: bookDetails.title,
                        author: bookDetails.author,
                        nop: `${bookDetails.nop}`,
                        imgUrl: bookDetails.imgUrl,
                        price: `${bookDetails.price}`,
                        discountPrice: `${bookDetails.discountPrice}`,
                        abstract: bookDetails.abstract,
                        publisher: bookDetails.publisher,
                        language: bookDetails.language,
                        isbn: bookDetails.isbn,
                        category: bookDetails.category,
                        brought: email,
                        status: "sold",
                        //uploadImg: bookDetails.uploadImg,
                        userMail: bookDetails.userMail
                    }
                },
                unit_amount:Math.round(bookDetails.discountPrice*100)  //cents
            },
            quantity:1
        }]

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: 'http://localhost:5173/payment-success',
            cancel_url: 'http://localhost:5173/payment-Error'
        });

        console.log(session);

        res.status(200).json({url:session.url})
        

    } catch (err) {

        res.status(500).json(err)

    }

}




exports.getAllAdminBooks = async (req, res) => {

    const searchKey = req.query.search
    console.log(searchKey);
    try {

        const homeBooks = await books.find()
        res.status(200).json(homeBooks)

    } catch (err) {

        res.status(500).json(err)

    }

}

exports.getABook = async (req, res) => {

    try {
        const { id } = req.params
        console.log(id);

        const book = await books.findOne({ _id: id })
        res.status(200).json(book)

    } catch (err) {

        res.status(500).json(err)

    }

}

exports.deleteABookController = async (req, res) => {

    try {
        const { id } = req.params
        console.log(id);

        await books.findByIdAndDelete({ _id: id })
        res.status(200).json('Book deleted')

    } catch (err) {

        res.status(500).json(err)

    }

}

exports.approveBookController = async (req, res) => {

    const { _id, title, author, nop, imgUrl, price, discountPrice, abstract, publisher, language, isbn, category, brought, status, uploadImg, userMail } = req.body
    console.log(_id, title, author, nop, imgUrl, price, discountPrice, abstract, publisher, language, isbn, category, brought, status, uploadImg, userMail);

    try {

        const existingBooks = await books.findByIdAndUpdate({ _id }, { _id, title, author, nop, imgUrl, price, discountPrice, abstract, publisher, language, isbn, category, brought, status: "approved", uploadImg, userMail }, { new: true })
        res.status(200).json(existingBooks)

    } catch (err) {

        res.status(500).json(err)

    }

}

