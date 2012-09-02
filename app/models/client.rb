class Client < ActiveRecord::Base
  set_table_name "cfinfo"
  scope :search, lambda { |key| 
    where("lastname like ? or firstname like ? or address like ?", "%#{key}%", "%#{key}%", "%#{key}%").order("lastname, firstname") 
  }
  has_many :properties, :foreign_key => "cfid", :inverse_of => :client
  has_many :valid_properties, :class_name => "Property", :foreign_key => "cfid", :conditions => "validuntil is null or validuntil = \'\'"
  has_many :jobs, :through => :properties
  has_many :done_jobs, :class_name => "Job", :through => :properties, :conditions => "datebi is not null", :source => :jobs
end
