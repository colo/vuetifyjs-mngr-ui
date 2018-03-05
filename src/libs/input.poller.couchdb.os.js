'use strict'

//import App from '../../node_modules/node-app-cradle-client/index'
const App = require ( '../../node_modules/node-app-couchdb-client/index' )


//var console.log = require('console.log')('InputPollerCradleOS');
//var console.log = require('console.log')('InputPollerCradleOS:Internals');
//var console.log = require('console.log')('InputPollerCradleOS:Events');

export default new Class({
  Extends: App,

  host: 'colo',

  options: {

		requests : {

			periodical: [
				{
					sort_by_path: function(req, next, app){
						next(app.view({
							uri: 'dashboard',
              args: [
                'sort',
                'by_path',
                {
  								startkey: ["os", app.host, "periodical",Date.now()],
  								endkey: ["os", app.host, "periodical", Date.now() - 5000],
  								/**
  								 * pouchdb
  								 * */
  								// startkey: ["os", app.host, "periodical\ufff0"],
  								// endkey: ["os", app.host, "periodical"],
  								/** **/
  								limit: 1,
  								descending: true,
  								inclusive_end: true,
  								include_docs: true
  							}
              ]
						}))
					}
				}
				//{
					//view: function(req, next, app){
						//console.log('---periodical')

							//let cb = next.pass(
								////console.log('---next')
								//app.view({//get doc by host->last.timestamp (descending = true, and reversed star/end keys)
									//uri: 'dashboard',
									//id: 'sort/by_path',
									//data: {
										////startkey: ["os", app.host, "periodical",Date.now()],
										////endkey: ["os", app.host, "periodical", Date.now() - 2000],
										///**
										 //* pouchdb
										 //* */
										//startkey: ["os", app.host, "periodical\ufff0"],
										//endkey: ["os", app.host, "periodical"],
										///** **/
										//limit: 1,
										//descending: true,
										//inclusive_end: true,
										//include_docs: true
									//}
								//}).bind(app)
							//);

							//cb.attempt();
					//}
				//}
				//{
					//view: function(req, next, app){//wrap it on a func, so we can call "this", as "app"
						//console.log('---periodical')
						//let cb = next.pass(
							////console.log('---next')
							//app.view({
								//uri: 'dashboard/_design/sort/_view/by_path',
								//headers: {
									//'Accept': 'application/json'
								//},
								//qs: {

										////startkey: ["os", this.host, "periodical",Date.now()],
										////endkey: ["os", this.host, "periodical", Date.now() - 2000],
										///**
										 //* pouchdb
										 //* */
										//startkey: ["os", app.host, "periodical\ufff0"],
										//endkey: ["os", app.host, "periodical"],
										///** **/

										//limit: 1,
										////reduce: true, //avoid geting duplicate host
										////group: true,
										//descending: true,
										//inclusive_end: true,
										//include_docs: true

								//}
							//})//app.view
						//)//next

						//cb.attempt();

					//}
				//}
			],

		},

		routes: {
			/**
      exists: [
				{
					path: ':database',
					callbacks: ['exists'],
				}
			],
      **/
			request: [
				{
					path: '',
					callbacks: ['request'],
				}
			],
			view: [
				{
					path: ':database',
					callbacks: ['sort_by_path'],
					//version: '',
				},
			]
		},


  },

  sort_by_path: function(err, resp){
		// console.log('this.sort_by_path %o', resp);

		if(err){
			console.log('this.sort_by_path error %o', err);

		}
		else{
			//let result = JSON.decode(resp.body)

			console.log('this.get result %o', resp);

      if(resp.rows[0]){
				this.fireEvent('onPeriodicalDoc', [resp.rows[0].doc, {type: 'periodical', input_type: this, app: null}]);

				// for (var key in resp.rows[0].doc.data) {
				// 	console.log(key);
        //   if(key == 'cpus')
        //     console.log(resp.rows[0].doc.data['cpus'])
				// }
			}
		}
  },
  request: function(err, resp){
		// console.log('this.info %o', resp);

		//console.log('---INFO RESP---');
		//this.get({uri: 'dashboard/cache', doc: 'localhost.colo.os.blockdevices@1515636560970'});
		//console.log(resp);
		if(err){
			console.log('this.info error %o', err);
			//this.fireEvent(this.ON_CONNECT_ERROR, err);
		}
	},
  initialize: function(options){
		this.parent(options);//override default options

		this.profile('root_init');//start profiling


		this.profile('root_init');//end profiling

		this.log('root', 'info', 'root started');
  },
  connect: function(){
		console.log('this.connect');

		try{
			//this.os.api.get({uri: 'hostname'});
			//this.get({uri: '/'}, this._first_connect.bind(this));
			this.request(
        {
          opts: {
            path: '/'
          }
        },
        this._first_connect.bind(this)
      );



			// this.view({
			// 	uri: 'dashboard',
			// 	// id: 'sort/by_path',
      //   args: [
      //     'sort',
      //     'by_path',
      //     {
      //       startkey: ["os", 'colo', "periodical",Date.now()],
      //       endkey: ["os", 'colo', "periodical", Date.now() - 2000],
      //       /**
      //        * pouchdb
      //        * */
      //       // startkey: ["os", app.host, "periodical\ufff0"],
      //       // endkey: ["os", app.host, "periodical"],
      //       /** **/
      //       limit: 1,
      //       descending: true,
      //       inclusive_end: true,
      //       include_docs: true
      //     }
      //   ],
      //
			// }, function(err, resp){
			// 	console.log('view', err);
			// 	console.log('view', resp);
			// })

		}
		catch(e){
			console.log(e);
		}
	},
	_first_connect: function(err, result, body, opts){
		// console.log('first_connect %o', result.uuid);
		this.options.id = result.uuid;//set ID

	}

});
