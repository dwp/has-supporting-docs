//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const versions = [
    'version-x',
    'v11x-htln-547',
    'v11x-htln-547-editPage',
    'v11x-htln-547-reviewed',
    'vStarling-nil',
    'vStarling-award',
    'v10x-htln-491-mvp-leftNav',
   'v10x-htln-491-mvp-admin',
   'v11x-htln-744-new-admin&hcpView',
   'v11x-htln-974-HCPReviewPrompts',
   'v888'
]



console.log('Setting up main router. Locating sub routers');
versions.forEach((version) => require(`${__dirname}/views/${version}/routes/routes.js`));

router.all('*', (req, res, next) => {
    res.locals.params = req.params;
    res.locals.query = req.query;
    return next();
});

// Add your routes here
router.post('/autosave', function (req, res) {
    req.session.data[req.body.field] = req.body.value;
    req.session.data.lastSaved = new Date().toLocaleString('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true });
    res.status(200).json({});
});


// HCP review add another

router.post('/v11x-htln-974-HCPReviewPrompts/has-general/IR-landingPage-playback*', (req, res, next) => {    
    let errors = {
        errorList: []
    }
    for (let i = 0; i <= 10; i++) {

        if(req.body["hcpreviewpip" + i] === undefined && req.body["ir-outcomes" + i] === undefined) {
            continue;
        }



if (!req.body["ir-outcomes" + i]) {
    errors.errorList.push({
        text: "Select an outcome",
        href: "#ir-outcomes" + i
    });
    errors["ir-outcomes" + i] = "Select an outcome"
}
if (errors.errorList.length > 0) {
    break;
}
}
if (errors.errorList.length > 0) {
res.locals.errors = errors;
return res.render('v11x-htln-974-HCPReviewPrompts/has-general/IR-landingPage-playback');
}
if(req.body.submit === 'Continue') {
return res.redirect('/v11x-htln-974-HCPReviewPrompts/has-general/IR-landingPage-playback.html');

} else if (req.body.submit === 'Add another entry') {
return res.redirect('/v11x-htln-974-HCPReviewPrompts/has-general/IR-landingPage-playback?viewmode=add')
} else {
return next();
}
});
