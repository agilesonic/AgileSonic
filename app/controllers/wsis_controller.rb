class WsisController < ApplicationController
  layout "wsis"
  
  def index
    
  end
  
  def login
    render :json => {
      :success => params['username'] == 'richard' || params['username'] == 'roger',
      :username => params['username'],
      :msg => params['username'] == 'richard' ? 'Login successful' : 'Login failed'
    }
  end
  
  def logout
    render :json => {
      :success => true
    }
  end
  
  def smartSearch
    key = params['key']
    clients = Client.search(key)
    render :json => {
      :success => true,
      :clients => clients 
    }
  end
  
  def updateClient
    cfid = params['CFID']
    firstname = params['firstname']
    lastname = params['lastname']
    client = Client.find(cfid)
    if client
      client.firstname = firstname
      client.lastname = lastname
      client.save
      render :json => {
        :success => true
      }
    else
      render :json => {
        :success => true,
        :msg => "Cannot find client " + cfid
      }
    end
  end

end
