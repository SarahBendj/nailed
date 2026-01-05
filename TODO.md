# DEFAULT VALUES IN BDD 
- Availability TABLE : add an automatic record for every creation in column 'date' 

# Sharpen DTOs

- create models also need dtos




#-DATABSE MIGRATION
ALTER TABLE consumer ADD COLUMN consent boolean default false


#- NEED TO MOUNT REIDS

#- NEED TO MOUNT A DISC FOR MEDIA DOCS


# JOURNALISER LES EVENTS 
 VIA UNE TABLE QUI GARDE ET SUIT LES EVENTS BOOKING


PORT OUVERTURE

 # 1. Delete old rule (if it exists)
netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=192.168.1.11

# 2. Add the new one with your current WSL IP
netsh interface portproxy add v4tov4 listenaddress=192.168.1.11 listenport=3000 connectaddress=172.18.211.108 connectport=3000

# 3. Check it’s active
netsh interface portproxy show all
