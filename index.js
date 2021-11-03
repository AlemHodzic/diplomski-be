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


app.get('/aktuelnosti', (req, res) => {
    try {
        connection.query("call aktuelnosti", (err, rows) => {
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

//ROK_STUDENTI
app.get('/fetchUser/:id', (req, res) => {
  
    try {
        connection.query(`call fetchStudent(${req.params.id})`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.post('/prijaviRok', (req, res) => {

    try {
        connection.query(`insert into rok_studenti (rok_id, student_indeks)
        values (${req.body.rok_id}, ${req.body.student_indeks})`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.get('/fetchRok/:id', (req, res) => {
    try {
        connection.query(`call dohvatiRokZaStudenta(${req.params.id})`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.get('/fetchPrijavljene', (req, res) => {
    try {
        connection.query(`call dohvatiSvePrijave()`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})


app.post('/deletePrijavu', (req, res) => {
    try {
        connection.query(`delete from rok_studenti where student_indeks=${req.body.student_indeks} and rok_id = ${req.body.rok_id} `, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

//OCJENJIVANJE

app.get('/ocjene', (req, res) => {
    try {
        connection.query("call prikaziOcjene", (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.get('/ocjena/:id', (req, res) => {
    try {
        connection.query(`call prikaziJednuOcjenu(${req.params.id})`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.put('/editOcjena', (req, res) => {
    const { id: _id } = req.params
    const post = req.body
    try {
        connection.query(`update ocjena set ocjena = ${req.body.ocjena} where idocjena = ${req.body.idocjena};`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.post('/unesiOcjenu', (req, res) => {

    try {
        connection.query(`insert into ocjena (student_indeks, rok_id, ocjena, predmet_id) values (${req.body.student_indeks}, ${req.body.rok_id}, ${req.body.ocjena}, ${req.body.predmet_id})`, (err, rows) => {
            res.status(200).json(rows[0]);
        })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})