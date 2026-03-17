RESERVATION_CANCELLED
MISSING_ID
YOUR_BOOKING_IS_EXPIRED
MISSING_DATA
PASSWORD_UPDATED
  USER_NOT_AUTHENTICATED
   AT_LEAST_ONE_IMAGE_REQUIRED

login
phone &
pwd

fullname
email 
phone
pwd
role 
device_id
salle [0 N]



salle
name
wilaya
commune
addresse
lat & long
image /10 
video 
capacité
type de la salle villa 




the rating
name :
rate :
date ;





availability 
user_id
hall_id





hall_specifity 








hall_services 




notification
    sender_id 
    receiver_id [ 0 , Z,  X]
    message 
    title : 
    date 





 

 an woner might have more than one 




 CREATE TABLE users (
    id INT generated always as identity PRIMARY KEY,
    fullname VARCHAR(150),
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
     role VARCHAR(20) NOT NULL CHECK (role IN ('OWNER', 'CLIENT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE halls (
    id INT generated always as identity PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    wilaya VARCHAR(100),
    commune VARCHAR(100),
    address TEXT,
    capacity INT,
    hall_services JSONB,

    type TEXT NOT NULL CHECK (type IN ('PLEIN_AIR', 'SALLE', 'VILLA', 'TERRASSE')),
     -- Pricing (day)
    price_day NUMERIC(10,2),
    interval_day_from TIME,
    interval_day_to TIME,

    -- Pricing (evening)
    price_evening NUMERIC(10,2),
    interval_evening_from TIME,
    interval_evening_to TIME,

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    media_folder VARCHAR(255),

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    media_folder VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE hall_images (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  hall_id INT NOT NULL,
  key TEXT NOT NULL,
  is_cover BOOLEAN DEFAULT false,
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE CASCADE
);



CREATE TABLE refresh_token (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE
);
