// crée la fonction Render() [avec une majuscule car c'est une class] qui est appellée quand on fait le require dans app.js
function Render(){
	// on récupère le model créé pour gérer les pages
	const PagesModel = require(`${process.cwd()}/src/models/pages`);
	// on fait une instance du model pour pouvoir accéder à ses fonction internes
    const model = PagesModel();

    
	// on crée la fonction middleware pour express qui va faire les traitements
	function middleware(req, res, next) {
	  	console.log('render');
	  	// vérifie si la page voulue existe via une fonction interne à notre PageModel()
	  	let page = model.searchPageByUrl(req.url);

	  	// si la page existe
	  	if(page){
	  		console.log(page);
	  		// rendu de la page avec les données contenues dans le fichier pages.json et les meta qui seront contenues dans la variable "meta"
	  		res.render(page.template, {layout: page.layout, meta:page.meta});
	  		// res.send(`Page Found !`);
	  	} else{
	  		// sinon on passe à la suite [ici la suite dans app.js est la gestion des erreurs]
	        next();
	  	}
	}

	// on retourne le middleware pour pouvoir appeller la fonction avec render() si on a définit const render = require(...);
	return middleware;
}
	

module.exports = Render;