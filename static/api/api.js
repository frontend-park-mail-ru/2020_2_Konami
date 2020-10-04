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

export {
    postUser,
    getPeople,
    getUser,
    getMeetings,
};