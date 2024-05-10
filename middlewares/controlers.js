const indexControler = function(req, res, next) {
  if (req.session){
    if (!('views' in req.session)) {
        req.session.views = 0;
    }
    else {
      ++req.session.views;
    }
  }
  else {
    throw('Session should be initialized');
  }
  res.render('index',{views:req.session.views});
};

const renderControler = function(req, res, next) {
  try {
    res.render('index',{views:req.session.views,userName:'self'});
  }
  catch (e) {
    console.log(e);
  }
  finally {
    next();
  }
};

const viewControler = function(req, res, next) {
  if (req.session){
    if (!('views' in req.session)) {
      req.session.views = 0;
    }
    else {
      ++req.session.views;
    }
  }
  else {
    //TO DO
    req.session.views = 0;
  }
  next();
}

const consoleControler = function(req,res,next){
  console.log(Object.entries(req.route.methods).filter(([k,v])=>v).map(([k,v])=>k) + ' ' + req.route.path);
}

module.exports = {indexControler,renderControler,viewControler,consoleControler};