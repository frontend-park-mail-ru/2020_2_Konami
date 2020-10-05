'use strict';

function postUser(field, text) {
    return fetch('/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify({
            field,
            text,
        }),
    }).then(response => {
        return response.status;
    });
}

function getUser(userId) {
    let statusCode;
    return fetch(`/user?userId=${userId}`, {
        method: 'GET',
        credentials: 'include',
    }).then(response => {
        statusCode = response.status;
        return response.json();
    }).then(parsedJson => {
        return {
            statusCode,
            parsedJson,
        };
    }); 
}

function getMeetings(pageNum) {
    let statusCode;
    return fetch(`/meetings?pageNum=${pageNum}`, {
        method: 'GET',
        credentials: 'include',
    }).then(response => {
        console.log(response.status);
        statusCode = response.status;
        return response.json();
    }).then(parsedJson => {
        return {
            statusCode,
            parsedJson,
        };
    }); 
}

function getPeople(pageNum) {
    let statusCode;
    return fetch(`/people?pageNum=${pageNum}`, {
        method: 'GET',
        credentials: 'include',
    }).then(response => {
        statusCode = response.status;
        return response.json();
    }).then(parsedJson => {
        return {
            statusCode,
            parsedJson,
        };
    }); 
}

const postLogin = async (login, password) => {
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then(
        response => {
         if (response.status === 200) {
             appConfig.profile.open();
         }
    }).catch(
        (error) => {
            console.log(error);
            return error;
        });
}

function postSignUp(login, password) {
    return fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then(
        (response) => {
            return {
                status: response.status,
            };
    }).catch(
        (error) => {
            console.log(error);
            return {
                error: error
            };
        });
}

export {
    postUser,
    getPeople,
    getUser,
    getMeetings,
    postLogin,
    postSignUp,
};
