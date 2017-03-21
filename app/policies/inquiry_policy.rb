class InquiryPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    organizer_or_admin?
  end

  def create?
    @user
  end

  def update?
    organizer?
  end

  def destroy?
    organizer_or_admin?
  end
  class Scope < Scope
    def user_roles
      rule_join = @user && @user.is_admin? ? "left join" : "join"
      joins_clause=["#{rule_join} Roles r on r.mname='Inquiry'",
                    "r.mid=Inquiries.id",
                    "r.user_id #{user_criteria}"].join(" and ")
      pp joins_clause
      scope.select("Inquiries.*, r.role_name")
           .joins(joins_clause)

    end
    def resolve
      user_roles
    end
  end
end
