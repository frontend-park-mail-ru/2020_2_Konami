'use strict';

const express = require('express');
const body = require('body-parser');
const formidable = require('express-formidable');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const uuid = require("uuid");
const app = express();
const fs = require('fs');

app.use(morgan('dev'));
// app.use(express.static(path.resolve(__dirname, '..', 'src')));
app.use(express.static(`${__dirname}/src`));
app.use(cookie());
app.use(body.json());

app.get('/api/user', function(req, res) {
    const userId = req.query.userId;

    if (userId in usersProfiles) {
        res.status(200).json(usersProfiles[userId]);
        console.log(usersProfiles[userId]);
    } else {
        res.status(404).send('');
    }
});

app.post('/api/user', function (req, res) {
    console.log(req.body);
    console.log(req.body.field);
    console.log(req.body.text);
    console.log(req.files);
    // Сюда будут иногда файлы без полей field && text прилетать

    // Тут нужно будет парсить слова с решеткой и вставлять в usercard
    // Тут вместо '52' нужен userId
    let token = req.cookies['authToken'];
    const userId = userSessions[token];
    Object.keys(req.body).forEach((key) => {
        usersProfiles[userId][key] = req.body[key];
        console.log('keke');
    });

    res.status(200).send('ok');
});

app.get('/api/people', function (req, res) {
    const pageNum = req.query.pageNum;
    console.log(pageNum);

    let users = [];
    Object.keys(usersProfiles).forEach(item => {
        users.push(usersProfiles[item]);
    });

    res.status(200).json(users);
});

app.get('/api/meet', function (req, res) {
    const meetId = req.query.meetId
    res.status(200).json(meetCards[meetId]);
});

app.post('/api/meet', function (req, res) {
    console.log(req.body.fields);
    console.log(req.body.meetId);

    let token = req.cookies['authToken'];
    const userId = userSessions[token];
    const meetId = req.body.meetId;
    Object.keys(req.body.fields).forEach((key) => {
        meetCards[meetId][key] = req.body.fields[key];
    });

    res.status(200).send('ok');
});

app.get('/api/meetings', function (req, res) {
    const pageNum = req.query.pageNum;
    console.log(pageNum);

    let meets = [];
    for (let i = 0; i < 100; i++) {
        meets.push(meetCards[52]);
    }
    res.status(200).json(meets);
});

app.get('/api/me', function (req, res) {
    const token = req.cookies['authToken'];
    const userId = userSessions[token];
    if (!userId) {
        return  res.status(401).end();
    }
    res.status(200).json({userId});
});


app.get('*', (req, res) => {
    console.log(req.url);
    res.sendFile(`${__dirname}/src/index.html`);
});



const meetCards = {
    '52': {
        id: 52,
        text: `Lorem ipsum dolor sit amet,
               consectetur adipiscing elit, sed
               do eiusmod tempor incididunt ut
               labore et dolore magna aliqua.
               Ut enim ad minim veniam, quis
               nostrud exercitation ullamco labori`,
        imgSrc: 'assets/paris.jpg',
        tags: ['Rust', 'Забив', 'В падике'],
        title: 'Забив с++',
        place: 'Дом Пушкина, улица Калатушкина',
        dateStr: '12 сентября 2020',
        like: true,
        reg: true,
    },
};

function createUserProfileTmpl() {
    return {
            imgSrc: '',
            name: '',
            city: '',
            telegram: '',
            vk: '',
            meetings: [],
            interests: ``,
            tags: [[], []],
            education: '',
            job: '',
            aims: '',
    };
}

const usersProfiles = {
    '52': {
        id: 52,
        imgSrc: 'assets/luckash.jpeg',
        name: 'Александр Лукашенко',
        city: 'Пертрозаводск',
        telegram: '',
        vk: 'https://vk.com/id241926559',
        meetings: [
            {
                imgSrc: 'assets/vk.png',
                text: 'Александр Лукашенко',
            },
            {
                imgSrc: 'assets/telegram.png',
                text: 'Александр Лукашенко',
            },
        ],
        interests: `
                Lorem ipsum dolor sit amet, 
                consectetur adipiscing elit, sed 
                do eiusmod tempor incididunt ut 
                labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis 
                nostrud exercitation ullamco 
                laboris nisi ut aliquip ex ea 
                commodo consequat. Duis aute 
                irure dolor in reprehenderit 
                in voluptate velit esse cillum `,
        interestTags: ['Картофель', 'Хоккей', 'Картофель', 'Хоккей', 'Картофель', 'Хоккей', 'Картофель', 'Хоккей', 'Картофель', 'Хоккей', 'Картофель', 'Хоккей', 'Картофель', 'Хоккей'],
        skills: `Lorem ipsum dolor sit amet, 
                consectetur adipiscing elit, sed 
                do eiusmod tempor incididunt ut 
                labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis 
                nostrud exercitation ullamco`,
        skillTags: ['Разгон митингов', 'Сбор урожая'],
        education: 'МГТУ им. Н. Э. Баумана до 2010',
        job: 'MAIL GROUP до 2008',
        aims: 'Хочу от жизни всего',
    },
};

const userSessions = {};
const userLoginPwdIdMap = {
    'lukash@mail.ru': {
        login: 'lukash@mail.ru',
        password: '12345',
        id: 52,
    }
}

app.post('/api/login', function (req, res) {
    const password = req.body.password;
    const login = req.body.login;
    if (!password || !login) {
        return res.status(400).json({error: 'Не указан E-Mail или пароль'});
    }
    if (!userLoginPwdIdMap[login] || userLoginPwdIdMap[login].password !== password) {
        return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
    }

    const token = uuid.v4();
    userSessions[token] = userLoginPwdIdMap[login].id;
    res.cookie('authToken', token, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.status(200).json({token});
});

app.post('/api/logout', function (req, res) {
    let token = req.cookies['authToken'];
    delete userSessions[token];

    res.cookie('authToken', token, {expires: new Date(Date.now() - 1000)});
    res.status(200).send('ok');
});

app.post('/api/signup', function (req, res) {
    const password = req.body.password;
    const login = req.body.login;

    if (login in userLoginPwdIdMap) {
        res.status(409).json({error: 'Такой логин уже существует'});
    }

    const Ids = Object.keys(usersProfiles);
    const newId = parseInt(Ids[Ids.length - 1], 10) + 1;

    usersProfiles[newId] = createUserProfileTmpl();
    userLoginPwdIdMap[login] = {login: login, password: password, id: newId};

    res.status(200).send('ok');
});

app.post('/api/images', function(req, res) {
    console.log(req.query);
    console.log(req.fields, req.files);
    res.status(200).send('ok');

});

// app.post('/api/tmpimages', function(req, res) {
//     console.log(req.fields, req.files);
//     const pathToImg = 'assets/telegram.png';
//
//     return res.status(200).json({pathToImg});
// });

app.post('/api/meeting', function(req, res) {
    console.log(req.fields, req.files);

    return res.status(201).send('ok');
});

const port = process.env.PORT || 8000;

app.listen(port, function () {
  console.log(`Server listening port ${port}`);
});
