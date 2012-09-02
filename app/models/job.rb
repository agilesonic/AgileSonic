class Job < ActiveRecord::Base
  belongs_to :property
  
  scope :assigned_jobs, lambda { |schdate, crew| where("schdate = ? and crewname = ?", schdate.mysql_date, crew) } 
  
  WORK_STATUS_CURRENT = "current"
  WORK_STATUS_NEXT    = "next"
  
  def property
    Property.find(self.JobInfoID)
  end
  
  def client
    Client.find(self.property.CFID)    
  end

  def completed?
    !self.Datebi.nil?
  end
  
  def started?
    !self.reportstime.nil?
  end
  
  def next?
    self.workstatus == WORK_STATUS_NEXT
  end
  
  def current?
    self.workstatus == WORK_STATUS_CURRENT
  end
end
