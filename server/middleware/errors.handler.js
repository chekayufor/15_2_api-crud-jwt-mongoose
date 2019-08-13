const marker = require('@ajar/marker')
const{White,Reset,Red} = marker.constants;
const { NODE_ENV } = process.env;

const error_handler =  (err, req, res, next) => {
    marker.error(err);
    if(NODE_ENV === 'development')res.status(500).json({status:err.message,stack:err.stack});
    else res.status(500).json({status:'internal server error...'});
}
const not_found =  (req, res) => {
    marker.info(`url: ${White}${req.url}${Reset}${Red} not found...`);
    res.status(404).json({status:`url: ${req.url} not found...`});
}

module.exports = {
    error_handler,
    not_found
}

