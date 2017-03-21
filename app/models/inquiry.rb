class Inquiry < ActiveRecord::Base
  include Protectable
  validates_presence_of :name, :contents
end
