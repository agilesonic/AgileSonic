class Property < ActiveRecord::Base
  set_table_name "cfjobinfo"
  belongs_to :client, :foreign_key => "cfid", :inverse_of => :properties
  has_many :jobs, :foreign_key => "jobinfoid"
  has_one :geocode, :foreign_key => "id"
end
