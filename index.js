import cors from 'cors';
import express, { response } from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';


const app = express();

const port = process.env.PORT || 5000;
app.listen(port);

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '1mb' }))

console.log('App is listening on port' + port);

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'studentska-sluzba',
    port: '3306'
})

connection.connect((err) => {
    if (err) {
        throw err
    } else {
        console.log('connected');
    }
})

app.get('/getStudents', (req, res) => {
    try {
        connection.query("call dohvatiStudente", (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.get('/getStudent/:id', async (req, res) => {
    const { id: _id } = req.params
    try {
        connection.query(`call dohvatiStudenta(${_id})`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.put('/', (req, res) => {
    const { id: _id } = req.params
    const post = req.body
    try {
        connection.query(`update korisnik inner join student on korisnik.korisnik_id = student.korisnik_id
        set
        korisnik.ime = '${req.body.ime}', korisnik.prezime= '${req.body.prezime}', korisnik.JMBG=${req.body.JMBG}, korisnik.email= '${req.body.email}',
        student.odsjek_id = ${req.body.odsjek_id}
        where student.student_indeks = ${req.body.student_indeks}
        ;`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})


app.post('/', (req, res) => {
    let korisnik_id = Math.floor(Math.random() * 999999);
    console.log(req.body);
    try {
        connection.query(`insert into student (korisnik_id, student_indeks, odsjek_id, godina_studija)
        values (${korisnik_id},${req.body.student_indeks}, ${req.body.odsjek_id}, 1)`, (err, rows) => {
            res.status(200).json(rows[0]);
            console.log("uspjesno dodan")
        })

    } catch (error) {
        res.status(404).json({ message: error.message })
    }

    try {
        connection.query(`insert into korisnik (rola, korisnik_id, ime, prezime, JMBG, sifra, email)
            values ('student',${korisnik_id},'${req.body.ime}', '${req.body.prezime}', ${req.body.JMBG}, '${req.body.sifra}', '${req.body.email}');`, (err, rows) => {
            res.status(200).json(rows[0]);
            console.log("uspjesno dodan x2")

        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }

})

app.put('/archiveStudent', (req, res) => {
    const { id: _id } = req.params
    const post = req.body
    try {
        connection.query(`update korisnik inner join student on korisnik.korisnik_id = student.korisnik_id
        set
        korisnik.active= 'no'
        where student.student_indeks = ${req.body.student_indeks};`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})



//PROFESOR - DIO

app.get('/getProfesors', (req, res) => {
    try {
        connection.query("call dohvatiProfesore", (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.get('/getProfesor/:id', async (req, res) => {
    const { id: _id } = req.params
    try {
        connection.query(`call dohvatiProfesora(${_id})`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
});


app.post('/profesor', (req, res) => {
    let korisnik_id = Math.floor(Math.random() * 999999);
    console.log(korisnik_id);
    try {
        connection.query(`insert into korisnik (rola, korisnik_id, ime, prezime, JMBG, sifra, email)
            values ('profesor', ${korisnik_id},'${req.body.ime}', '${req.body.prezime}', ${req.body.JMBG}, '${req.body.sifra}', '${req.body.email}');`, (err, rows) => {
            res.status(200).json(rows[0]);
            console.log("uspjesno dodan x2")

        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
    try {
        connection.query(`insert into profesor (korisnik_id)
        values (${korisnik_id})`, (err, rows) => {
            res.status(200).json(rows[0]);
            console.log("uspjesno dodan")
        })

    } catch (error) {
        res.status(404).json({ message: error.message })
    }

})

app.put('/profesor', (req, res) => {
    const { id: _id } = req.params
    const post = req.body
    try {
        connection.query(`update korisnik inner join profesor on korisnik.korisnik_id = profesor.korisnik_id
        set
        korisnik.ime = '${req.body.ime}', korisnik.prezime= '${req.body.prezime}', korisnik.JMBG=${req.body.JMBG}, korisnik.email= '${req.body.email}'
        where profesor.korisnik_id = ${req.body.korisnik_id}
        ;`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.put('/archiveProfesor', (req, res) => {
    const { id: _id } = req.params
    const post = req.body
    try {
        connection.query(`update korisnik inner join profesor on korisnik.korisnik_id = profesor.korisnik_id
        set
        korisnik.active= 'no'
        where profesor.korisnik_id = ${req.body.korisnik_id};`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})


//ODSJEK
app.get('/getOdsjek', (req, res) => {
    try {
        connection.query("call dohvatiOdsjek", (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

//godine
app.get('/getGodine', (req, res) => {
    try {
        connection.query("call dohvatiGodine", (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

/*PREDMET*/

app.get('/getPredmets', (req, res) => {
    try {
        connection.query("call dohvatiPredmete", (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})


app.get('/getPredmet/:id', async (req, res) => {
    const { id: _id } = req.params
    try {
        connection.query(`call dohvatiPredmet(${_id})`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.post('/predmet', (req, res) => {
    try {
        connection.query(`insert into predmet (naziv, opis, ECTS, odsjek_id, profesor_id, godina_studija)
        values ('${req.body.naziv}', '${req.body.opis}', ${req.body.ECTS}, ${req.body.odsjek_id}, ${req.body.profesor_id}, ${req.body.godina_studija});`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.put('/predmet', (req, res) => {
    const { id: _id } = req.params
    const post = req.body
    try {
        connection.query(`update predmet
        set naziv='${req.body.naziv}', opis='${req.body.opis}', ECTS=${req.body.ECTS}, odsjek_id=${req.body.odsjek_id}, profesor_id=${req.body.profesor_id}, godina_studija=${req.body.godina_studija}
        where predmet_id = ${req.body.predmet_id}`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})


app.put('/archivePredmet', (req, res) => {
    const { id: _id } = req.params
    const post = req.body
    try {
        connection.query(`update predmet
        set
        active= 'no'
        where predmet_id = ${req.body.predmet_id};`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})


//ROKOVI SVI
app.get('/getRokovi', (req, res) => {
    try {
        connection.query("call dohvatiSveRokove", (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})


app.get('/getRok/:id', async (req, res) => {
    const { id: _id } = req.params
    try {
        connection.query(`call dohvatiRok(${_id})`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.post('/rok', (req, res) => {
    try {
        connection.query(`insert into ispitni_rok (datum_ispita, datum_otvaranja, datum_zatvaranja, br_ucionice, predmet_id)
        values ('${req.body.datum_ispita}', '${req.body.datum_otvaranja}', '${req.body.datum_zatvaranja}', ${req.body.br_ucionice}, ${req.body.predmet_id});`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.put('/rok', (req, res) => {
    const { id: _id } = req.params

    console.log(req.body.rok_id)
    try {
        connection.query(`update ispitni_rok
        set datum_ispita='${req.body.datum_ispita}', datum_otvaranja='${req.body.datum_otvaranja}', datum_zatvaranja='${req.body.datum_zatvaranja}', br_ucionice=${req.body.br_ucionice}, predmet_id=${req.body.predmet_id}
        where rok_id = ${req.body.rok_id}`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.put('/archiveRok', (req, res) => {
    const { id: _id } = req.params
    const post = req.body
    try {
        connection.query(`update ispitni_rok
        set
        active= 'no'
        where rok_id = ${req.body.rok_id};`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})



//NOVOST


app.get('/novost', (req, res) => {
    try {
        connection.query("call dohvatiNovosti", (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.get('/novost/:id', async (req, res) => {
    const { id: _id } = req.params
    try {
        connection.query(`call dohvatiNovost(${_id})`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})



app.post('/novost', (req, res) => {
    try {
        connection.query(`insert into novosti (naslov, podnaslov, sadrzaj, slika, datum_kreiranja)
        values ('${req.body.naslov}', '${req.body.podnaslov}', '${req.body.sadrzaj}', '${req.body.slika}', '${req.body.datum_kreiranja}');`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})


app.post('/deleteNovost', (req, res) => {
    try {
        connection.query(`delete from novosti where idnovosti=${req.body.idnovosti} `, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})




//LOGIN
app.post('/login', (req, res) => {
    try {
        connection.query(`call login('${req.body.email}', '${req.body.pw}')`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})



/*
let newUser = {
    ime: 'aa',
    prezime: 'bb',
    email: 'a@a.com',
    sifra: 'sif',
    rola: 'korisnikRola',
    adresa: 'adr',
    broj: 123456,
    korisnickoIme: 'kime'
}

app.post('/register',urlencode
dParser, (req,res) => {
    newUser.ime = req.body.firstname;
    newUser.prezime = req.body.lastname;
    newUser.email = req.body.email;
    newUser.sifra = req.body.password;
    connection.query(
        `INSERT INTO Korisnik(ime, prezime, email, sifra, rola, adresa, broj, korisnickoIme)
        VALUES (
         '${newUser.ime}',
         '${newUser.prezime}',
         '${newUser.email}',
         '${newUser.sifra}',
         '${newUser.rola}',
         '${newUser.adresa}',
         '${newUser.broj}',
         '${newUser.korisnickoIme}')`
         ,(err,rows) => {
       if(err){
         throw err
       }
       console.log('Korisnik dodan u db.')
       })
       getUsers();
})




let podaci = null;
let produkti = null;
let reviews = null;
let id;
let singleProduct;

const getUsers = (req, res) => {
    try {
        connection.query( "SELECT * FROM Korisnik",(err,rows) => {
    if(err){
      throw err
    }
    podaci = rows;
    })

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

getUsers();

const getReviews = (req, res) => {
    try {
        connection.query( "SELECT * FROM Recenzija",(err,rows) => {
    if(err){
      throw err
    }
    reviews = rows;
    })

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

getReviews();

app.get('/getUsers', (req,res) => {
    res.json({
        podaci
    })
})

app.get('/getReviews', (req,res) => {
    res.json({
        reviews
    })
})

app.get('/getProducts', (req,res) => {
    res.json({
        produkti
    })
})

app.get('/getProducts/:id', (req,res) => {
    singleProduct = produkti.filter(x => x.proizvodID == req.params.id)
    res.json({
        singleProduct
    })
})


const getProducts = (req, res) => {
    try {
        connection.query( "SELECT * FROM Proizvod",(err,rows) => {
    if(err){
      throw err
    }
    produkti = rows;
    })

    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

getProducts();




let newUser = {
    ime: 'aa',
    prezime: 'bb',
    email: 'a@a.com',
    sifra: 'sif',
    rola: 'korisnikRola',
    adresa: 'adr',
    broj: 123456,
    korisnickoIme: 'kime'
}

app.post('/register',urlencodedParser, (req,res) => {
    newUser.ime = req.body.firstname;
    newUser.prezime = req.body.lastname;
    newUser.email = req.body.email;
    newUser.sifra = req.body.password;
    connection.query(
        `INSERT INTO Korisnik(ime, prezime, email, sifra, rola, adresa, broj, korisnickoIme)
        VALUES (
         '${newUser.ime}',
         '${newUser.prezime}',
         '${newUser.email}',
         '${newUser.sifra}',
         '${newUser.rola}',
         '${newUser.adresa}',
         '${newUser.broj}',
         '${newUser.korisnickoIme}')`
         ,(err,rows) => {
       if(err){
         throw err
       }
       console.log('Korisnik dodan u db.')
       })
       getUsers();
})

let newReview = {
    pID: 0,
    kID: 0,
    sadRec: '',
    oc: 0,
}

app.post('/addReview',urlencodedParser, (req,res) => {
    newReview.pID = req.body.proizvodID;
    newReview.kID = req.body.korisnikID;
    newReview.sadRec = req.body.sadrzajRecenzije;
    newReview.oc = req.body.ocjena;
    connection.query(
        `INSERT INTO Recenzija (proizvodID, korisnikID, sadrzajRecenzije, ocjena)
        VALUES ('${newReview.pID}','${newReview.kID}','${newReview.sadRec}','${newReview.oc}');`,(err,rows) => {
       if(err){
         throw err
       }
       console.log('Recenzija dodana u db.')
       })
       getReviews();
})

let newProduct = {
  cijenaProizvoda: 0,
  bojaProizvoda: 'n',
  kvantitetProizvoda: 0,
  brendProizvoda: 'n',
  kategorijaProizvoda: '',
  imeProizvoda: '',
  opisProizvoda: '',
  slikaUrl: ''
}

app.post('/addProduct',urlencodedParser, (req,res) => {
    newProduct.cijenaProizvoda = Number(req.body.cijenaProizvoda);
    newProduct.kvantitetProizvoda = Number(req.body.kvantitetProizvoda);
    newProduct.kategorijaProizvoda = req.body.kategorijaProizvoda;
    newProduct.imeProizvoda = req.body.imeProizvoda;
    newProduct.opisProizvoda = req.body.opisProizvoda;
    newProduct.slikaUrl = req.body.slikaUrl;
    connection.query(
        `INSERT INTO Proizvod (cijenaProizvoda, bojaProizvoda, kvantitetProizvoda, brendProizvoda, kategorijaProizvoda, imeProizvoda, opisProizvoda, slikaUrl)
        VALUES ('${newProduct.cijenaProizvoda}','${newProduct.bojaProizvoda}','${newProduct.kvantitetProizvoda}','${newProduct.brendProizvoda}','${newProduct.kategorijaProizvoda}','${newProduct.imeProizvoda}','${newProduct.opisProizvoda}','${newProduct.slikaUrl}')`,(err,rows) => {
       if(err){
         throw err
       }
       console.log('Proizvod dodan u db.')
       })
       getProducts();
})

app.delete('/deleteUser/:id', urlencodedParser, (req,res) => {
    connection.query(`DELETE FROM Korisnik WHERE korisnikID = ${req.params.id}`, 1, (error, results, fields) => {
        if (error)
          return console.error(error.message);
          getUsers();
        console.log('Deleted Row(s):', results.affectedRows);
      });
})

app.delete('/deleteProduct/:id', urlencodedParser, (req,res) => {
    connection.query(`DELETE FROM Proizvod WHERE proizvodID = ${req.params.id}`, 1, (error, results, fields) => {
        if (error)
          return console.error(error.message);
          getProducts();
        console.log('Deleted Row(s):', results.affectedRows);
      });
})

app.put('/editProduct/:id', urlencodedParser, (req,res) => {
    console.log(req.body)
    newProduct.cijenaProizvoda = req.body.cijenaProizvoda;
    newProduct.kvantitetProizvoda = req.body.kvantitetProizvoda;
    newProduct.kategorijaProizvoda = req.body.kategorijaProizvoda;
    newProduct.imeProizvoda = req.body.imeProizvoda;
    newProduct.opisProizvoda = req.body.opisProizvoda;
    newProduct.slikaUrl = req.body.slikaUrl;
    connection.query(`UPDATE Proizvod
    SET cijenaProizvoda = '${newProduct.cijenaProizvoda}', kvantitetProizvoda = '${newProduct.kvantitetProizvoda}', kategorijaProizvoda = '${newProduct.kategorijaProizvoda}', imeProizvoda = '${newProduct.imeProizvoda}', opisProizvoda = '${newProduct.opisProizvoda}', slikaUrl = '${newProduct.slikaUrl}'
    WHERE proizvodID = ${req.params.id}`, 1, (error, results, fields) => {
        if (error)
          return console.error(error.message);
          getProducts();
        console.log('Updated Row(s):', results.affectedRows);
      });
})
getProducts(); */