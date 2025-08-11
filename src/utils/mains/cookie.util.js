const setTokenCookie = (res, responseData) => {
    const token  = responseData?.token ?? null;
    
    if(token && process.env.TOKEN_TYPE === 'cookie'){
        res.cookie("_menatreyd", token, {
            httpOnly: true,
            // secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
    }
}

const extractCookieToken = (req) => {
    return req.cookies._menatreyd;
}


module.exports = {
    setTokenCookie,
    extractCookieToken,
}