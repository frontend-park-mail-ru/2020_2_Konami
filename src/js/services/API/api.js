'use strict';

function getCSRF() {
    return fetch(`/api/csrf`, {
        method: 'GET',
        credentials: 'include',
    }).then(response => {
        return {
            csrf: response.headers.get('Csrf-Token'),
        };
    }).catch(error => {
        return {
            error: error,
        };
    });
}

function postUser(editFields) {
    return getCSRF().then(obj => {
        return fetch('/api/user', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Csrf-Token': obj.csrf,
            },
            credentials: 'include',
            body: JSON.stringify(editFields),
        }).then(response => {
            return {
                statusCode: response.status,
            };
        }).catch((error) => {
            return {
                error: error,
            };
        });
    });
}

function getUser(userId) {
    let statusCode;
    return fetch(`/api/user?userId=${userId}`, {
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
    }).catch(error => {
        return {
            error: error,
        };
    });
}

function getMeeting(meetId) {
    let statusCode;
    return fetch(`/api/meeting?meetId=${meetId}`, {
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
    }).catch(error => {
        return {
            error: error,
        };
    });
}

function getSearchMeeting(queryString, limit) {
    let statusCode;
    return fetch(`/api/meetings/search?query=${queryString}&limit=${limit}`, {
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
    }).catch(error => {
        return {
            error: error,
        };
    });
}

function patchMeeting(editFields) { // редактирование митинга
    return getCSRF().then(obj => {
        return fetch('/api/meeting', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Csrf-Token': obj.csrf,
            },
            credentials: 'include',
            body: JSON.stringify(editFields),
        }).then(
            (response) => {
                return {
                    statusCode: response.status,
                };
        }).catch(error => {
            return {
                error: error,
            };
        });
    });
}

function getMeetings(queryParams, slug) {
    let params = '?';
    if (queryParams !== undefined) {
        Object.keys(queryParams).forEach(key => {
            if (key === 'meta') {
                params += `${queryParams[key]}`;
            } else if (queryParams[key] !== undefined && 
                    queryParams[key] !== null && 
                    queryParams[key] !== '') {
                params += `${key}=${queryParams[key]}&`
            }
        });
    }

    if (params === '?') {
        params = '';
    } else {
        params = params.slice(0, params.length - 1);
    }

    if (slug !== undefined && slug !== '' && slug !== null) {
        slug = `/${slug}`;
    } else {
        slug = '';
    }

    console.log(params);

    let statusCode;
    return fetch(`/api/meetings${slug}${params}`, {
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
    }).catch(error => {
        return {
            error: error,
        };
    });
}

function getSubscriptions() {
    let statusCode;
    return fetch(`/api/subscriptions`, {
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
    }).catch(error => {
        return {
            error: error,
        };
    });
}

function getPeople(queryParams) {
    let params = '?';
    if (queryParams !== undefined) {
        Object.keys(queryParams).forEach(key => {
            if (queryParams[key] !== undefined && 
                    queryParams[key] !== null && 
                    queryParams[key] !== '') {
                params += `${key}=${queryParams[key]}&`
            }
        });
    }

    if (params === '?') {
        params = '';
    } else {
        params = params.slice(0, params.length - 1);
    }

    let statusCode;
    return fetch(`/api/people${params}`, {
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
    }).catch(error => {
        return {
            error: error,
        };
    });
}

function postPhoto(data) {
    return getCSRF().then(obj => {
        return fetch('/api/images', {
            method: 'POST',
            headers: {
                'Csrf-Token': obj.csrf,
            },
            credentials: 'include',
            body: data,
        }).then(response => {
            return {
                statusCode: response.status,
            };
        }).catch(error => {
            return {
                error: error
            };
        });
    });
}

function postSubscribeUser(targetId, isSubscribe) {
    const obj = {targetId};
    console.log(obj);
    return getCSRF().then(obj => {
        if (isSubscribe) {
            return fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Csrf-Token': obj.csrf,
                },
                credentials: 'include',
                body: JSON.stringify({targetId}),
            }).then(response => {
                return {
                    statusCode: response.status,
                };
            }).catch(error => {
                return {
                    error: error
                };
            });
        } else {
            return fetch('/api/unsubscribe', {
                method: 'DELETE',
                headers: {
                    'Csrf-Token': obj.csrf,
                },
                credentials: 'include',
                body: JSON.stringify({targetId}),
            }).then(response => {
                return {
                    statusCode: response.status,
                };
            }).catch(error => {
                return {
                    error: error
                };
            });
        }
    });
}

const postLogin = async (login, password) => {
    return fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then(response => {
        return {
            statusCode: response.status,
        };
    }).catch(error => {
        return {
            error: error,
        };
    });
}

function getMe() {
    let statusCode;
    return fetch('/api/me', {
        method: 'GET',
        credentials: 'include'
    }).then(
        (response) => {
            statusCode = response.status;
        return response.json();
    }).then(parsedJson => {
        return {
            statusCode: statusCode,
            body: parsedJson,
        }
    }).catch(error => {
        return {
            error: error
        }
    });
}

function postSignUp(login, password) {
    return fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        credentials: 'include',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then(
        (response) => {
            return {
                statusCode: response.status,
            };
    }).catch(error => {
        return {
            error: error
        };
    });
}

function postSignOut() {
    return fetch('/api/logout', {
        method: 'DELETE',
        credentials: 'include',
    }).then(response => {
        return {
            statusCode: response.status,
        };
    }).catch(error => {
        return {
            error: error
        };
    });
}

function postMeeting(fields) {  // новый митинг
    return getCSRF().then(obj => {
        return fetch('/api/meeting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Csrf-Token': obj.csrf,
            },
            credentials: 'include',
            body: JSON.stringify(fields),
        }).then(response => {
            return {
                statusCode: response.status,
            };
        }).catch(error => {
            return {
                error: error,
            };
        });
    });
}

function postMessage(payload) {
    return getCSRF().then(obj => {
        return fetch('/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Csrf-Token': obj.csrf,
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        }).then(response => {
            return {
                statusCode: response.status,
            };
        }).catch(error => {
            return {
                error: error,
            };
        });
    });
}

function getMessages(meetId) {
    let statusCode;
    return fetch(`/api/messages?meetId=${meetId}`, {
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
    }).catch(error => {
        return {
            error: error,
        };
    });
}

export {
    postUser,
    getPeople,
    getUser,
    getMeeting,
    getSearchMeeting,
    patchMeeting,
    getMeetings,
    postPhoto,
    postLogin,
    getMe,
    postSignUp,
    postSignOut,
    postMeeting,
    postMessage,
    getMessages,
    postSubscribeUser,
    getSubscriptions,
};
