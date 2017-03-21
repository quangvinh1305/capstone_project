(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.InquiriesAuthz", InquiriesAuthzFactory);

  InquiriesAuthzFactory.$inject = ["spa-demo.authz.Authz",
                                "spa-demo.authz.BasePolicy"];
  function InquiriesAuthzFactory(Authz, BasePolicy) {
    function InquiriesAuthz() {
      BasePolicy.call(this, "Inquiry");
    }
      //start with base class prototype definitions
    InquiriesAuthz.prototype = Object.create(BasePolicy.prototype);
    InquiriesAuthz.constructor = InquiriesAuthz;


    //override and add additional methods
    InquiriesAuthz.prototype.canQuery=function() {
      //console.log("InquiriesAuthz.canQuery");
      return Authz.isAuthenticated();
    };

    //add custom definitions
		InquiriesAuthz.prototype.canGetDetails = function(item) {
			if (!item) {
				return false;
			} else {
				return !item.id ? this.canCreate() : (Authz.isOrganizer(item) || Authz.isAdmin());
			}
		};

		InquiriesAuthz.prototype.canCreate=function() {
      //console.log("InquiriesAuthz.canCreate");
      return Authz.isAuthenticated();
		};
		
		
    return new InquiriesAuthz();
  }
})();
