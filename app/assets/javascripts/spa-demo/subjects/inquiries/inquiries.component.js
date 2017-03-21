(function() {
   "use strict";

   angular
     .module("spa-demo.subjects")
     .component("sdInquiryEditor", {
       templateUrl: inquiryEditorTemplateUrl,
       controller: InquiryEditorController,
       bindings: {
         authz: "<"
       },
       require: {
         inquiriesAuthz: "^sdInquiriesAuthz"
       }
     })
     .component("sdInquirySelector", {
       templateUrl: inquirySelectorTemplateUrl,
       controller: InquirySelectorController,
       bindings: {
         authz: "<"
       }
     })
     ;


   inquiryEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
   function inquiryEditorTemplateUrl(APP_CONFIG) {
     return APP_CONFIG.inquiry_editor_html;
   }
   inquirySelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
   function inquirySelectorTemplateUrl(APP_CONFIG) {
     return APP_CONFIG.inquiry_selector_html;
   }

   InquiryEditorController.$inject = ["$scope","$q",
                                    "$state","$stateParams",
                                    "spa-demo.authz.Authz",
                                    "spa-demo.subjects.Inquiry"];
   function InquiryEditorController($scope, $q, $state, $stateParams,
                                  Authz, Inquiry) {
     var vm=this;
     vm.create = create;
     vm.clear  = clear;
     vm.update  = update;
     vm.remove  = remove;

     vm.$onInit = function() {
       console.log("InquiryEditorController",$scope);
       $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
                     function(){
                       if ($stateParams.id) {
                         reload($stateParams.id);
                       } else {
                         newResource();
                       }
                     });
     }

     return;
     //////////////
     function newResource() {
       vm.item = new Inquiry();
       vm.inquiriesAuthz.newItem(vm.item);
       return vm.item;
     }

     function reload(inquiryId) {
       var itemId = inquiryId ? inquiryId : vm.item.id;
       console.log("re/loading inquiry", itemId);
       vm.item = Inquiry.get({id:itemId});
       vm.inquiriesAuthz.newItem(vm.item);
       $q.all([vm.item.$promise]).catch(handleError);
     }

     function create() {
       vm.item.errors = null;
       vm.item.$save().then(
         function(){
           console.log("inquiry created", vm.item);
           $state.go(".",{id:vm.item.id});
         },
         handleError);
     }

     function clear() {
       newResource();
       $state.go(".",{id: null});
     }

     function update() {
       vm.item.errors = null;
       vm.item.$update().then(
 				function(response){
 					console.log("Updated Inquiry", response);
 					$scope.inquiryform.$setPristine();
 				},
 				handleError);
     }

     function remove() {
       vm.item.$remove().then(
         function(){
           console.log("inquiry removed", vm.item);
           clear();
         },
         handleError);
     }

     function handleError(response) {
       console.log("error", response);
       if (response.data) {
         vm.item["errors"]=response.data.errors;
       }
       if (!vm.item.errors) {
         vm.item["errors"]={}
         vm.item["errors"]["full_messages"]=[response];
       }
       $scope.inquiryform.$setPristine();
     }
   }

   InquirySelectorController.$inject = ["$scope",
                                      "$stateParams",
                                      "spa-demo.authz.Authz",
                                      "spa-demo.subjects.Inquiry"];
   function InquirySelectorController($scope, $stateParams, Authz, Inquiry) {
     var vm=this;

     vm.$onInit = function() {
       console.log("InquirySelectorController",$scope);
       $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
                     function(){
                       if (!$stateParams.id) {
                         vm.items = Inquiry.query();
                       }
                     });
     }
     return;
     //////////////
   }

 })();
