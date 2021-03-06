// single global container to encapsulate all celody core data
var celody = {};           

/* "compass" module requires user permission to geolocation/gps API for lat-lon and heading
*  heading changes the pan of the song - north/south is center, west is left, east is right
*  load the stream as a jsonObject, pass the position in object
*  can load file as static object hardcoded into file
*  can load file via json ajax response from remote server
*  can load file from The Tangle using a p2p node
*/
function loadStreamFile(jsonCurrent,jsonSlot) {                    
    // basic celody object containers
    celody.streamInfo = [];
    celody.soundFile = [];
    celody.soundOptions = [];            
    celody.soundFX = [];            

    // get the stream data                                
    if ((jsonCurrent) && (jsonCurrent[jsonSlot])) {
        validateStreamFile(jsonCurrent);                
    } else {                
        console.log("There is no data for this stream.");
        stopStreams();
        return false;
    }

    function validateStreamFile(jsonCurrent) {
        // set the stream primitives - filter and validate   
        celody.streamInfo[0] = [];
        celody.streamInfo[0].soundsLoaded = false;
        celody.streamInfo[0].error = false;
        celody.streamInfo[0].stop = false;
        celody.streamInfo[0].masterVolume = 0.5;
        if (jsonCurrent[jsonSlot].streamId) {
            celody.streamInfo[0].streamId = validateString(filterXSS(jsonCurrent[jsonSlot].streamId),0,256);                            
        } else {
            celody.streamInfo[0].streamId = "";
        }              
        if (jsonCurrent[jsonSlot].streamName) {                
            celody.streamInfo[0].streamName = validateString(filterXSS(jsonCurrent[jsonSlot].streamName),1,250);
            if (!celody.streamInfo[0].streamName) {celody.streamInfo[0].error = true;}
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid stream name.");
        }        
        if (jsonCurrent[jsonSlot].artist) {
            celody.streamInfo[0].artist = validateString(filterXSS(jsonCurrent[jsonSlot].artist),1,250);                                
            if (!celody.streamInfo[0].artist) {celody.streamInfo[0].error = true;}
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid artist name.");
        }        
        if (jsonCurrent[jsonSlot].createDate) {
            celody.streamInfo[0].createDate = validateString(filterXSS(jsonCurrent[jsonSlot].createDate),10,10);                                
            if (!celody.streamInfo[0].createDate) {celody.streamInfo[0].error = true;}
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid create date.");
        }        
        if (jsonCurrent[jsonSlot].forkedFromStreamId) {
            celody.streamInfo[0].forkedFromStreamId = validateString(filterXSS(jsonCurrent[jsonSlot].forkedFromStreamId),0,256);                            
        } else {
            celody.streamInfo[0].forkedFromStreamId = "";
        }           
        if (jsonCurrent[jsonSlot].mergedFromStreamId1) {                    
            celody.streamInfo[0].mergedFromStreamId1 = validateString(filterXSS(jsonCurrent[jsonSlot].mergedFromStreamId1),0,256);            
        } else {
            celody.streamInfo[0].mergedFromStreamId1 = "";
        }              
        if (jsonCurrent[jsonSlot].mergedFromStreamId2) {
            celody.streamInfo[0].mergedFromStreamId2 = validateString(filterXSS(jsonCurrent[jsonSlot].mergedFromStreamId2),0,256);            
        } else {
            celody.streamInfo[0].mergedFromStreamId2 = "";
        }
        if (jsonCurrent[jsonSlot].forks) {
            celody.streamInfo[0].forks = validateNumber(filterXSS(jsonCurrent[jsonSlot].forks));
            celody.streamInfo[0].forks = validateRange(celody.streamInfo[0].forks,0,1000000000,0,1000000000);
        } else {
            celody.streamInfo[0].forks = 0;
        }        
        if (jsonCurrent[jsonSlot].merges) {
            celody.streamInfo[0].merges = validateNumber(filterXSS(jsonCurrent[jsonSlot].merges));
            celody.streamInfo[0].merges = validateRange(celody.streamInfo[0].merges,0,1000000000,0,1000000000);
        } else {
            celody.streamInfo[0].merges = 0;
        }        
        if (jsonCurrent[jsonSlot].tokens) {                    
            celody.streamInfo[0].tokens = validateArrayString(filterXSS(jsonCurrent[jsonSlot].tokens),"");
        } else {
            celody.streamInfo[0].tokens = "";
        }
        if (jsonCurrent[jsonSlot].tokenAddresses) {
            celody.streamInfo[0].tokenAddresses = validateArrayString(filterXSS(jsonCurrent[jsonSlot].tokenAddresses),"");
        } else {
            celody.streamInfo[0].tokenAddresses = "";
        }
        if ((jsonCurrent[jsonSlot].tokens) && (jsonCurrent[jsonSlot].tokenAddresses)) {
            // validate tokens correspond 1-to-1 with addresses    
            if (jsonCurrent[jsonSlot].tokens.length !== jsonCurrent[jsonSlot].tokenAddresses.length) {
                celody.streamInfo[0].error = true;
                console.log("This stream file has tokens that do not match token addresses.");
            }
            // cycle through to set the token-address text
            celody.streamInfo[0].tokenCounter = 0;
            celody.streamInfo[0].tokenDisplay = "";
            while (celody.streamInfo[0].tokenCounter < jsonCurrent[jsonSlot].tokens.length) {
                celody.streamInfo[0].tokenDisplay = celody.streamInfo[0].tokenDisplay + jsonCurrent[jsonSlot].tokens[celody.streamInfo[0].tokenCounter] + ": " + jsonCurrent[jsonSlot].tokenAddresses[celody.streamInfo[0].tokenCounter];
                if (celody.streamInfo[0].tokenCounter < jsonCurrent[jsonSlot].tokens.length - 1) {
                    celody.streamInfo[0].tokenDisplay = celody.streamInfo[0].tokenDisplay + ", "
                }
                celody.streamInfo[0].tokenCounter++;
            }            
        }       
        if (jsonCurrent[jsonSlot].module) {
            celody.streamInfo[0].module = validateModule(filterXSS(jsonCurrent[jsonSlot].module));
        } else {
            // default to core if not specified
            celody.streamInfo[0].module = "core";
        } 
        if (jsonCurrent[jsonSlot].tempo) {
            celody.streamInfo[0].tempo = validateNumber(filterXSS(jsonCurrent[jsonSlot].tempo));
            celody.streamInfo[0].tempo = validateRange(celody.streamInfo[0].tempo,30,150,30,150);
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid tempo.");
        }                    
        if (jsonCurrent[jsonSlot].playSpeed) {
            celody.streamInfo[0].playSpeed = validateNumber(filterXSS(jsonCurrent[jsonSlot].playSpeed));
            celody.streamInfo[0].playSpeed = validateRange(celody.streamInfo[0].playSpeed,0.5,2,0.5,2);
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid play speed.");
        }
        if (jsonCurrent[jsonSlot].beatsPerBar) {
            celody.streamInfo[0].beatsPerBar = validateNumber(filterXSS(jsonCurrent[jsonSlot].beatsPerBar));
            celody.streamInfo[0].beatsPerBar = validateRange(celody.streamInfo[0].beatsPerBar,1,500,1,500);
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid beats per bar.");
        }
        if (jsonCurrent[jsonSlot].bars) {
            celody.streamInfo[0].bars = validateNumber(filterXSS(jsonCurrent[jsonSlot].bars));
            celody.streamInfo[0].bars = validateRange(celody.streamInfo[0].bars,1,1000,1,1000);
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid bars element.");
        }
        if (jsonCurrent[jsonSlot].baseUnit) {
            celody.streamInfo[0].baseUnit = validateNumber(filterXSS(jsonCurrent[jsonSlot].baseUnit));   
            celody.streamInfo[0].baseUnit = validateRange(celody.streamInfo[0].baseUnit,1,1000,1,1000);
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid base unit.");
        }   
        if (jsonCurrent[jsonSlot].backgroundLevel) {
            celody.streamInfo[0].backgroundLevel = validateNumber(filterXSS(jsonCurrent[jsonSlot].backgroundLevel));
            celody.streamInfo[0].backgroundLevel = validateRange(celody.streamInfo[0].backgroundLevel,0,1,0.1,0.85);
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid background level.");
        }
        if ((jsonCurrent[jsonSlot].dynamics) || (jsonCurrent[jsonSlot].dynamics === 0)) {
            celody.streamInfo[0].dynamics = validateNumber(filterXSS(jsonCurrent[jsonSlot].dynamics));
            celody.streamInfo[0].dynamics = validateRange(celody.streamInfo[0].dynamics,0,1,0,1);
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid dynamics.");
        }
        if ((jsonCurrent[jsonSlot].density) || (jsonCurrent[jsonSlot].density === 0)) {
            celody.streamInfo[0].density = validateNumber(filterXSS(jsonCurrent[jsonSlot].density));
            celody.streamInfo[0].density = validateRange(celody.streamInfo[0].density,0,1,0,1);
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid density.");
        }
        if ((jsonCurrent[jsonSlot].variety) || (jsonCurrent[jsonSlot].variety === 0)) {
            celody.streamInfo[0].variety = validateNumber(filterXSS(jsonCurrent[jsonSlot].variety));
            celody.streamInfo[0].variety = validateRange(celody.streamInfo[0].variety,0,1,0,1);
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid variety.");
        }
        if ((jsonCurrent[jsonSlot].spread) || (jsonCurrent[jsonSlot].spread === 0)) {
            celody.streamInfo[0].spread = validateNumber(filterXSS(jsonCurrent[jsonSlot].spread));
            celody.streamInfo[0].spread = validateRange(celody.streamInfo[0].spread,0,1,0,1);                  
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid spread.");
        }           
        if ((jsonCurrent[jsonSlot].spice) || (jsonCurrent[jsonSlot].spice === 0)) {
            celody.streamInfo[0].spice = validateNumber(filterXSS(jsonCurrent[jsonSlot].spice));
            celody.streamInfo[0].spice = validateRange(celody.streamInfo[0].spice,0,1,0,1);
        } else {
            celody.streamInfo[0].error = true;
            console.log("This stream file has an invalid spice.");
        }                                
        // handle the instruments validation within the stream
        if ((jsonCurrent[jsonSlot].instruments) && (jsonCurrent[jsonSlot].instruments[0]) && (!celody.streamInfo[0].error)) {
            celody.instrumentDisplay = "";  
            validateInstruments(jsonCurrent[jsonSlot].instruments);                
        } else {                                                  
            stopStreams();
            return false;
        }
        return false;
    }

    function validateInstruments(instrumentContainer) {
        // get the total instruments for stream
        function count(obj) { return Object.keys(obj).length; }
        celody.instrumentCount = count(instrumentContainer);  
        celody.instrumentIndex = 0;
        celody.streamInfo[0].totalSounds = 0;
        celody.streamInfo[0].primarySounds = 0;
        celody.counter = 0; // counter of all sounds across instruments                               
        celody.tempSecondary = ""; // temporary holder of secondary instrument key
        celody.secondaryOffset = []; // secondary instrument count from primary
        celody.secondaryFlag = false; // if a secondary has been validated
        // cycle through the instruments 
        while (celody.instrumentIndex < celody.instrumentCount) {                                        
            // get the total sounds for this instrument
            if ((instrumentContainer[celody.instrumentIndex]) && (instrumentContainer[celody.instrumentIndex][0].basePhrase)) {
                celody.soundCount = instrumentContainer[celody.instrumentIndex][0].basePhrase.length;                                                                
                // add to totalSounds for stream
                celody.streamInfo[0].totalSounds = Number(celody.streamInfo[0].totalSounds) + celody.soundCount;                    
            } else {
                celody.soundCount = 0;
                celody.streamInfo[0].error = true;                                                
                console.log("This stream file has an invalid total number of sounds.");
            }
            // check if primary or secondary - if primary add to primary count
            if (instrumentContainer[celody.instrumentIndex][0].type) {
                if (instrumentContainer[celody.instrumentIndex][0].type[0] === "primary") {
                    // set up the display for primary sounds
                    if (instrumentContainer[celody.instrumentIndex][0].instrument) {
                    celody.instrumentDisplay = celody.instrumentDisplay + validateString(filterXSS(instrumentContainer[celody.instrumentIndex][0].instrument),0,256);
                    if (celody.instrumentIndex < celody.instrumentCount - 1) {
                        celody.instrumentDisplay = celody.instrumentDisplay + ", ";
                    } 
                    }
                    celody.streamInfo[0].primarySounds = Number(celody.streamInfo[0].primarySounds) + celody.soundCount;                    
                    // check that all any secondary instruments occur after all primaries
                    if (celody.secondaryFlag) {celody.streamInfo[0].error = true;}
                    // check if the primary has a linked secondary
                    celody.tempSecondary = "";
                    if (instrumentContainer[celody.instrumentIndex][0].type.length >= 2) {
                        celody.tempSecondary = validateString(filterXSS(instrumentContainer[celody.instrumentIndex][0].type[1]),1,1000);
                        // check that the secondary exists as a key
                        if (instrumentContainer[celody.tempSecondary]) {
                            // check the secondary has same number of sounds as primary
                            if (celody.soundCount !== instrumentContainer[celody.tempSecondary][0].basePhrase.length) {
                                celody.streamInfo[0].error = true;                                
                                console.log("This stream file has primary instruments that do not match secondary instruments.");
                            }
                        } else {
                            celody.streamInfo[0].error = true;                                 
                            console.log("This stream file has invalid instrument types.");
                        }
                    }
                } else if (instrumentContainer[celody.instrumentIndex][0].type[0] === "secondary") {                            
                    // set the secondary flag - because a secondary has been reached
                    celody.secondaryFlag = true;
                    // set the counter offset from the primary
                    celody.secondaryOffset[celody.instrumentIndex] = celody.counter;
                } else {
                    celody.streamInfo[0].error = true;                        
                    console.log("This stream file has invalid instrument types.");
                }
            } else {
                celody.streamInfo[0].error = true;                                      
                console.log("This stream file has invalid instrument types.");          
            }   
            if (celody.instrumentIndex >= celody.instrumentCount - 1) {            
                if (celody.instrumentDisplay.endsWith(", ")) {celody.instrumentDisplay = celody.instrumentDisplay.slice(0, -2)}                      
            }
            // validate each key value in instrument          
            if (Number(Object.keys(instrumentContainer)[celody.instrumentIndex]) !== celody.instrumentIndex) {
                // instruments should have incrmenting key values
                celody.streamInfo[0].error = true;                   
                console.log("This stream file has invalid instrument keys. Keys should increment by 1");
            }                                                     
            // validate instrument phrases have equal subcomponents (each sound phrase has volume,panning,etc)                        
            if (!((instrumentContainer[celody.instrumentIndex][0].baseStart) && (instrumentContainer[celody.instrumentIndex][0].baseStart.length === celody.soundCount))) {
                celody.streamInfo[0].error = true;                   
                console.log("This stream file has an invalid baseStart array. Array elements should have an equal count across an instrument.");
            }
            if (!((instrumentContainer[celody.instrumentIndex][0].volumeStart) && (instrumentContainer[celody.instrumentIndex][0].volumeStart.length === celody.soundCount))) {
                celody.streamInfo[0].error = true;                   
                console.log("This stream file has an invalid volumeStart array. Array elements should have an equal count across an instrument.");
            }
            if (!((instrumentContainer[celody.instrumentIndex][0].fxFla) && (instrumentContainer[celody.instrumentIndex][0].fxFla.length === celody.soundCount))) {
                celody.streamInfo[0].error = true;                   
                console.log("This stream file has an invalid fxFla array. Array elements should have an equal count across an instrument.");
            }                         
            if (!((instrumentContainer[celody.instrumentIndex][0].fxLow) && (instrumentContainer[celody.instrumentIndex][0].fxLow.length === celody.soundCount))) {
                celody.streamInfo[0].error = true;                   
                console.log("This stream file has an invalid fxLow array. Array elements should have an equal count across an instrument.");
            }
            if (!((instrumentContainer[celody.instrumentIndex][0].fxAtt) && (instrumentContainer[celody.instrumentIndex][0].fxAtt.length === celody.soundCount))) {
                celody.streamInfo[0].error = true;                   
                console.log("This stream file has an invalid fxAtt array. Array elements should have an equal count across an instrument.");
            }
            if (!((instrumentContainer[celody.instrumentIndex][0].fxRel) && (instrumentContainer[celody.instrumentIndex][0].fxRel.length === celody.soundCount))) {
                celody.streamInfo[0].error = true;                   
                console.log("This stream file has an invalid fxRel array. Array elements should have an equal count across an instrument.");
            }
            if (!((instrumentContainer[celody.instrumentIndex][0].fxPan) && (instrumentContainer[celody.instrumentIndex][0].fxPan.length === celody.soundCount))) {
                celody.streamInfo[0].error = true;                   
                console.log("This stream file has an invalid fxPan array. Array elements should have an equal count across an instrument.");
            }
            // check if instrument is still valid
            if (celody.streamInfo[0].error) {                                      
                break;
            }
            celody.soundIndex = 0;                    
            // cycle through all the sounds for each instrument
            while (celody.soundIndex < celody.soundCount) {                                                                                                                               
                // get the options to set on existing sound
                celody.soundOptions[celody.counter] = []; 
                if (instrumentContainer[celody.instrumentIndex][0].instrument) {                      
                    celody.soundOptions[celody.counter].instrument = validateString(filterXSS(instrumentContainer[celody.instrumentIndex][0].instrument),1,250);
                    if (!celody.soundOptions[celody.counter].instrument) {celody.streamInfo[0].error = true;}
                } else {
                    console.log("This stream file has an invalid instrument name.");
                    celody.streamInfo[0].error = true;                       
                }  
                if ((instrumentContainer[celody.instrumentIndex][0].type) && (instrumentContainer[celody.instrumentIndex][0].type.length > 0)) {                      
                    celody.soundOptions[celody.counter].type = validateString(filterXSS(instrumentContainer[celody.instrumentIndex][0].type[0]),1,10);
                    if (!((celody.soundOptions[celody.counter].type === "primary") || (celody.soundOptions[celody.counter].type === "secondary"))) {
                        celody.streamInfo[0].error = true;
                        console.log("This stream file has an invalid instrument type.");
                    }
                } else {
                    celody.streamInfo[0].error = true;                       
                    console.log("This stream file has an invalid instrument type.");
                }
                if ((instrumentContainer[celody.instrumentIndex][0].type) && (instrumentContainer[celody.instrumentIndex][0].type.length > 1)) {                      
                    celody.soundOptions[celody.counter].secondary = validateString(filterXSS(instrumentContainer[celody.instrumentIndex][0].type[1]),1,10);        
                } else {
                    celody.soundOptions[celody.counter].secondary = "";                       
                }  
                if (instrumentContainer[celody.instrumentIndex][0].color) {
                    celody.soundOptions[celody.counter].color = validateString(filterXSS(instrumentContainer[celody.instrumentIndex][0].color),0,50);
                } else {
                    celody.soundOptions[celody.counter].color = "";
                }
                if ((instrumentContainer[celody.instrumentIndex][0].basePhrase) && (instrumentContainer[celody.instrumentIndex][0].basePhrase.length >= celody.soundIndex)) {
                    celody.fileSourceIndex = validateNumber(filterXSS(instrumentContainer[celody.instrumentIndex][0].basePhrase[celody.soundIndex]));                  
                    if ((instrumentContainer[celody.instrumentIndex][0].fileSource) && (instrumentContainer[celody.instrumentIndex][0].fileSource.length > celody.fileSourceIndex)) {
                        celody.soundOptions[celody.counter].filePath = validateUrl(filterXSS(instrumentContainer[celody.instrumentIndex][0].fileSource[celody.fileSourceIndex]),celody);
                    } else {
                        celody.streamInfo[0].error = true;                           
                        console.log("This stream file has an invalid instrument fileSource or basePhrase.");
                    }
                } else {
                    celody.streamInfo[0].error = true;                       
                    console.log("This stream file has an invalid instrument basePhrase.");
                }                                       
                if ((instrumentContainer[celody.instrumentIndex][0].baseStart) && (instrumentContainer[celody.instrumentIndex][0].baseStart.length >= celody.soundIndex)) {                                                                   
                    celody.soundOptions[celody.counter].baseStart = validateArrayNumber(filterXSS(instrumentContainer[celody.instrumentIndex][0].baseStart[celody.soundIndex]),celody);                    
                    celody.soundOptions[celody.counter].baseStart = validateRange(celody.soundOptions[celody.counter].baseStart,0,1,0,1);
                } else {
                    celody.streamInfo[0].error = true;                       
                    console.log("This stream file has an invalid instrument baseStart.");
                }
                if ((instrumentContainer[celody.instrumentIndex][0].volumeStart) && (instrumentContainer[celody.instrumentIndex][0].volumeStart.length >= celody.soundIndex)) {                
                    celody.soundOptions[celody.counter].volumeStart = validateArrayNumber(filterXSS(instrumentContainer[celody.instrumentIndex][0].volumeStart[celody.soundIndex]),celody);                                                
                    celody.soundOptions[celody.counter].volumeStart = validateRange(celody.soundOptions[celody.counter].volumeStart,0,1,0,1);
                } else {
                    celody.streamInfo[0].error = true;                       
                    console.log("This stream file has an invalid instrument volumeStart.");
                }
                if ((instrumentContainer[celody.instrumentIndex][0].fxFla) && (instrumentContainer[celody.instrumentIndex][0].fxFla.length >= celody.soundIndex)) {                
                    celody.soundOptions[celody.counter].fxFla = validateArrayNumber(filterXSS(instrumentContainer[celody.instrumentIndex][0].fxFla[celody.soundIndex]),celody);                                                                            
                    celody.soundOptions[celody.counter].fxFla = validateRange(celody.soundOptions[celody.counter].fxFla,0,1,0,1);
                } else {
                    celody.streamInfo[0].error = true;                       
                    console.log("This stream file has an invalid instrument fxFla.");
                }
                if ((instrumentContainer[celody.instrumentIndex][0].fxLow) && (instrumentContainer[celody.instrumentIndex][0].fxLow.length >= celody.soundIndex)) {                
                    celody.soundOptions[celody.counter].fxLow = validateArrayNumber(filterXSS(instrumentContainer[celody.instrumentIndex][0].fxLow[celody.soundIndex]),celody);                                                                            
                    celody.soundOptions[celody.counter].fxLow = validateRange(celody.soundOptions[celody.counter].fxLow,0,1,0,1);
                } else {
                    celody.streamInfo[0].error = true;                       
                    console.log("This stream file has an invalid instrument fxLow.");
                }
                if ((instrumentContainer[celody.instrumentIndex][0].fxAtt) && (instrumentContainer[celody.instrumentIndex][0].fxAtt.length >= celody.soundIndex)) {                
                    celody.soundOptions[celody.counter].fxAtt = validateArrayNumber(filterXSS(instrumentContainer[celody.instrumentIndex][0].fxAtt[celody.soundIndex]),celody);                                                                            
                    celody.soundOptions[celody.counter].fxAtt = validateRange(celody.soundOptions[celody.counter].fxAtt,0,1,0,1);
                } else {
                    celody.streamInfo[0].error = true;                       
                    console.log("This stream file has an invalid instrument fxAtt.");
                }
                if ((instrumentContainer[celody.instrumentIndex][0].fxRel) && (instrumentContainer[celody.instrumentIndex][0].fxRel.length >= celody.soundIndex)) {                
                    celody.soundOptions[celody.counter].fxRel = validateArrayNumber(filterXSS(instrumentContainer[celody.instrumentIndex][0].fxRel[celody.soundIndex]),celody);                                                                            
                    celody.soundOptions[celody.counter].fxRel = validateRange(celody.soundOptions[celody.counter].fxRel,0,1,0,1);
                } else {
                    celody.streamInfo[0].error = true;                       
                    console.log("This stream file has an invalid instrument fxRel.");
                }                                                             
                if ((instrumentContainer[celody.instrumentIndex][0].fxPan) && (instrumentContainer[celody.instrumentIndex][0].fxPan.length >= celody.soundIndex)) {                
                    celody.soundOptions[celody.counter].fxPan = validateArrayNumber(filterXSS(instrumentContainer[celody.instrumentIndex][0].fxPan[celody.soundIndex]),celody);                                                                            
                    celody.soundOptions[celody.counter].fxPan = validateRange(celody.soundOptions[celody.counter].fxPan,0,1,0,1);
                } else {
                    celody.streamInfo[0].error = true;                       
                    console.log("This stream file has an invalid instrument fxPan.");
                }                                     
                if (celody.streamInfo[0].error) {                                                                          
                    celody.streamInfo[0].primarySounds = 0;
                    celody.streamInfo[0].totalSounds = 0;
                    stopStreams();                    
                    return false;
                }
                celody.counter++;
                celody.soundIndex++;    
            }                
            celody.instrumentIndex++;                         
        }            
        // if there are no errors, move to loading sounds
        if (!celody.streamInfo[0].error) {loadInstrumentSounds(instrumentContainer);}
        return false;
    }

    function loadInstrumentSounds(instrumentContainer) { 
        celody.counter = 0; // reset counter of all sounds across instruments
        celody.soundLoaded = 0; // how many sounds have fully loaded                                                   
        celody.instrumentIndex = 0;                
        // cycle through the instruments 
        while (celody.instrumentIndex < celody.instrumentCount) {                                                            
            celody.soundIndex = 0;                    
            celody.soundCount = instrumentContainer[celody.instrumentIndex][0].basePhrase.length;                                                                
            // cycle through all the sounds for each instrument
            while (celody.soundIndex < celody.soundCount) {                                        
                celody.soundOptions[celody.counter].offsetFromPrimary = celody.counter;  
                // if secondary exists, calculate the final offset from the primary sound                        
                if ((celody.soundOptions[celody.counter].type === "primary") && (celody.soundOptions[celody.counter].secondary)) {
                    celody.soundOptions[celody.counter].offsetFromPrimary = celody.soundIndex + celody.secondaryOffset[Number(celody.soundOptions[celody.counter].secondary)]; 
                } 
                // create a new sound
                celody.soundFile[celody.counter] = new Pizzicato.Sound({ 
                    source: 'file',
                    options: { 
                        path: [celody.soundOptions[celody.counter].filePath],
                        volume: celody.soundOptions[celody.counter].volumeStart,
                        release: celody.soundOptions[celody.counter].fxRel,
                        attack: celody.soundOptions[celody.counter].fxAtt,
                        detached: false
                    }
                }, function(error) {
                    if (error) {                                
                        console.log("Your internet connection may down because audio did not load. Try reloading page.");                        
                        stopStreams();
                        return false;
                    } else {
                        // increment the load count
                        celody.soundLoaded++;
                        // check final sound loaded, then play
                        if (celody.soundLoaded == celody.streamInfo[0].totalSounds) {
                            //set the background level of main sound canvas
                            Pizzicato.volume = validateRange((1 - Number(celody.streamInfo[0].backgroundLevel)),0,1,0.1,0.85);
                            //play using specified module
                            playCompassInitStream(celody,0);
                        }
                    }
                });                                                                          
                // create the fx for the sound    
                celody.soundFX[celody.counter] = [];                    
                celody.soundFX[celody.counter].fxFla = new Pizzicato.Effects.Flanger({
                    time: 0.48,
                    speed: celody.soundOptions[celody.counter].fxFla,
                    depth: 0.41,
                    feedback: 0.11,
                    mix: 0.3
                });                   
                celody.soundFX[celody.counter].fxLow = new Pizzicato.Effects.LowPassFilter({
                    frequency: Math.round( celody.soundOptions[celody.counter].fxLow * 22000),
                    peak: 10
                });                        
                celody.soundFX[celody.counter].fxPan = new Pizzicato.Effects.StereoPanner({
                    pan: Math.round( ((celody.soundOptions[celody.counter].fxPan * 2) - 1) * 10 ) / 10,
                });                                                  
                celody.counter++;
                celody.soundIndex++;    
            }                
            celody.instrumentIndex++;
        }            
        return false;
    }            
    return false;
}

var celodyLoopTimer;
// set default altitude to true north
celody.heading = 0;
function playCompassInitStream(celody,loopCount) {
  // get the heading before the stream starts
  function successCompassInit(position) {
      celody.heading  = position.coords.heading;
      // validate heading
      if (!celody.heading) {
          // heading not returned by device, calculate using lat-lon
          celody.latitude  = position.coords.latitude;
          celody.longitude = position.coords.longitude;
          celody.latLonFlag = true;
          // validate lat should be between -90 and 90
          if ((!Number.isFinite(celody.latitude)) || (Number(celody.latitude) < -90) || (Number(celody.latitude) > 90)) {                       
              celody.latLonFlag = false;
          }
          // validate lon should be between -180 and 180
          if ((!Number.isFinite(celody.longitude)) || (Number(celody.longitude) < -180) || (Number(celody.longitude) > 180)) {                       
              celody.latLonFlag = false;
          }
          if (celody.latLonFlag) {
              // calculate the speed using 1.9 second offset from current lat-lon position
              setTimeout(function(){ navigator.geolocation.getCurrentPosition(successCompassInitCalc, errorCompassInit); }, (1.9 * 1000));     
          } else {
              // no lat-lon to calculate speed, default to zero
              celody.heading = 0;
              // move on to playing stream
              playCompassStream(celody,loopCount);
          }
      } else if ((!Number.isFinite(celody.heading)) || (Number(celody.heading) < 0) || (Number(celody.heading) > 360)) {                       
          celody.heading = 0;
          // move on to playing stream
          playCompassStream(celody,loopCount);
      } else {
          // move on to playing stream
          playCompassStream(celody,loopCount);
      }   
  }

  function successCompassInitCalc(position) {
      // get the second lat-lon to calculate speed manually   
      celody.latLonFlag = true;
      // validate lat should be between -90 and 90
      if ((!Number.isFinite(position.coords.latitude)) || (Number(position.coords.latitude) < -90) || (Number(position.coords.latitude) > 90)) {                       
          celody.latLonFlag = false;
      }
      // validate lon should be between -180 and 180
      if ((!Number.isFinite(position.coords.longitude)) || (Number(position.coords.longitude) < -180) || (Number(position.coords.longitude) > 180)) {                       
          celody.latLonFlag = false;
      }
      if (celody.latLonFlag) {
          // calculate the speed using 1.9 second offset from current lat-lon position
          calculateHeading(celody,loopCount,celody.latitude,celody.longitude,position.coords.latitude,position.coords.longitude,1.9*1000);     
      } else {
          // no lat-lon to calculate heading, default to zero
          celody.heading = 0;
          // move on to playing stream
          playCompassStream(celody,loopCount);
      }     
  }

  function errorCompassInit() {
      // on error, default to true north
      playCompassStream(celody,loopCount);
  }

  if (!navigator.geolocation) {
      // browser does not support geolocation, default to zero
      playCompassStream(celody,loopCount);
  } else {
      navigator.geolocation.getCurrentPosition(successCompassInit, errorCompassInit);
  }

}

function calculateHeading(celody,loopCount,latitude1,longitude1,latitude2,longitude2,timeDelta) {
  // convert degrees to radians
  latitude1 = latitude1 * Math.PI / 180.0;
  latitude2 = latitude2 * Math.PI / 180.0;
  longitude1 = longitude1 * Math.PI / 180.0;
  longitude2 = longitude2 * Math.PI / 180.0;
  var dLon = (longitude2 - longitude1);
  var y = Math.sin(dLon) * Math.cos(latitude2);
  var x = Math.cos(latitude1) * Math.sin(latitude2) - Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(dLon);
  celody.heading = Math.atan2(y, x);
  celody.heading = celody.heading * (180.0 / Math.PI);
  celody.heading = (celody.heading + 360) % 360;
  // validate heading
  if ((!Number.isFinite(celody.heading)) || (Number(celody.heading) < 0) || (Number(celody.heading) > 360)) {                       
      celody.heading = 0;
      // if loop is 0, move on to playing stream - else values get updated in recursive loop
      if (loopCount === 0) {
          playCompassStream(celody,loopCount);
      }         
  } else {
      // if loop is 0, move on to playing stream - else values get updated in recursive loop
      if (loopCount === 0) {
          playCompassStream(celody,loopCount);
      }
  }   
}

function playCompassStream(celody,loopCount) {
  celody.countIndex = 0;
  celody.countMax = 0;
  celody.countOffset = 0;
  celody.masterStart = 0;
  celody.tempClone = [];
  // set the number of sounds across the primary loop only (excludes variety sounds)
  if (celody.soundOptions) {celody.countMax = celody.streamInfo[0].primarySounds;}
  if ((!celody.soundOptions) || (!celody.streamInfo[0].primarySounds)) {                     
      console.log("This stream has no sounds. Try reloading page or choosing a different stream.");
      stopStreams();
      return false;
  }   
  
  // set loop time using tempo                                       
  celody.timePerBase = ((60 / (Number(celody.streamInfo[0].tempo))) * (celody.streamInfo[0].beatsPerBar / celody.streamInfo[0].baseUnit)); // seconds per base unit note
  celody.timePerLoop = celody.timePerBase * celody.streamInfo[0].baseUnit * celody.streamInfo[0].bars; // seconds per loop

  function successCompass(position) {
      celody.heading  = position.coords.heading;
      // validate heading
      if (!celody.heading) {
          // heading not returned by device, calculate using lat-lon
          celody.latitude  = position.coords.latitude;
          celody.longitude = position.coords.longitude;
          celody.latLonFlag = true;
          // validate lat should be between -90 and 90
          if ((!Number.isFinite(celody.latitude)) || (Number(celody.latitude) < -90) || (Number(celody.latitude) > 90)) {                       
              celody.latLonFlag = false;
          }
          // validate lon should be between -180 and 180
          if ((!Number.isFinite(celody.longitude)) || (Number(celody.longitude) < -180) || (Number(celody.longitude) > 180)) {                       
              celody.latLonFlag = false;
          }
          if (celody.latLonFlag) {
              // calculate the heading using 1.9 second offset from current lat-lon position
              setTimeout(function(){ navigator.geolocation.getCurrentPosition(successCompassCalc, errorCompass); }, (1.9 * 1000));     
          } else {
              // no lat-lon to calculate heading, default to zero
              celody.heading = 0;
          }
      } else if ((!Number.isFinite(celody.heading)) || (Number(celody.heading) < 0) || (Number(celody.heading) > 360)) {                                             
          celody.heading = 0;         
      }   
  }

  function successCompassCalc(position) {
      // get the second lat-lon to calculate heading manually   
      celody.latLonFlag = true;
      // validate lat should be between -90 and 90
      if ((!Number.isFinite(position.coords.latitude)) || (Number(position.coords.latitude) < -90) || (Number(position.coords.latitude) > 90)) {                       
          celody.latLonFlag = false;
      }
      // validate lon should be between -180 and 180
      if ((!Number.isFinite(position.coords.longitude)) || (Number(position.coords.longitude) < -180) || (Number(position.coords.longitude) > 180)) {                       
          celody.latLonFlag = false;
      }
      if (celody.latLonFlag) {
          // calculate the heading using 1.9 second offset from current lat-lon position
          calculateHeading(celody,loopCount,celody.latitude,celody.longitude,position.coords.latitude,position.coords.longitude,1.9*1000);     
      } else {
          // no lat-lon to calculate heading, default to zero
          celody.heading = 0;
      }     
  }

  function errorCompass() {
      // on error, default to current value
  }

  // set the playRate
  celody.playRate = celody.streamInfo[0].playSpeed;

  // adjust the pan for the heading relative to true north
  if ((Number(celody.heading) >= 0) && (Number(celody.heading) <= 90)) {
      // heading between north and east
      celody.tempPan = 0.5 + (0.45 * (Number(celody.heading)/90));
  } else if ((Number(celody.heading) > 90) && (Number(celody.heading) <= 180)) {
      // heading between south and east
      celody.tempPan = 0.5 + (0.45 * (((Number(celody.heading) - 180) * -1)/90));
  } else if ((Number(celody.heading) > 180) && (Number(celody.heading) <= 270)) {
      // heading between south and west    
      celody.tempPan = 0.5 - (0.45 * (((Number(celody.heading) - 180))/90));
  } else {
      // heading between north and west
      celody.tempPan = 0.5 - (0.45 * (((Number(celody.heading) - 360) * -1)/90));
  }

  // adjust the loop time by the playRate 
  if (Number(celody.playRate) > 0) {                                
      celody.timePerLoop = celody.timePerLoop / Number(celody.playRate);
  }

  // async timing may delay updates - running at 50% of loop time to compensate
  if (!navigator.geolocation) {
      // browser does not support geolocation, default to current value
  } else {
      // wait until half the loop runs before getting updated value
      setTimeout(function(){ navigator.geolocation.getCurrentPosition(successCompass, errorCompass); }, (celody.timePerLoop * 0.5 * 1000));
  }

  // handle drums for smoother rhythm: loop is either primary, secondary or mute
  celody.drumIndex = "primary";
  if (Math.random() - (0.8 * Math.random())  > celody.streamInfo[0].density) {
      celody.drumIndex = "mute";
  } else if (Math.random() > 0.7) {
      celody.drumIndex = "secondary";
  }

  // check for extreme loops
  if (!Number.isFinite(celody.timePerLoop)) {
      console.log("There is a problem with this stream. Try playing a different one.");
      return false;                
  } else if (celody.timePerLoop < 2) {                
      console.log("Your tempo is too fast. Please slow it down to lengthen the loop.");
      return false;
  } else if (celody.timePerLoop > 1 * 60 * 60) {                
      console.log("Your tempo is too slow. Please speed it up to shorten the loop.");
      return false;
  }            

  // cycle through each primary sound                
  while (celody.countIndex < celody.countMax) {                    
      // pick primary or secondary sound source
      celody.countOffset = celody.countIndex;
      if ((celody.soundOptions[celody.countOffset].type === "primary") && (celody.soundOptions[celody.countOffset].secondary)) {
          // get the lookup offset to the secondary source                    
          if ((celody.soundOptions[celody.countOffset].instrument === "drum") && (celody.drumIndex === "secondary")) {                                             
              celody.countOffset = Number(celody.soundOptions[celody.countIndex].offsetFromPrimary);
          } else if (Math.random() > 0.7) {      
              celody.countOffset = Number(celody.soundOptions[celody.countIndex].offsetFromPrimary);                        
          }
      }                    

      // dynamics - alter the volume of the phrase envelope                
      celody.tempVol = validateRange((celody.soundOptions[celody.countOffset].volumeStart * Math.round( (celody.streamInfo[0].masterVolume / 0.5)  * 10 ) / 10),0,1,0.1,0.85);
      celody.tempVol = randomDirection(celody.tempVol,Number(celody.tempVol),Number(Math.round( (celody.streamInfo[0].dynamics / 8)  * 10 ) / 10));                        

      // density - mute the sound to make phrase more sparse
      if ((celody.soundOptions[celody.countOffset].instrument === "drum") && (celody.drumIndex === "mute")) { 
          celody.tempVol = 0;
      } else if (Math.random() - (0.8 * Math.random())  > celody.streamInfo[0].density) {celody.tempVol = 0;}
      celody.tempRel = celody.soundOptions[celody.countOffset].fxRel;
      celody.tempAtt = celody.soundOptions[celody.countOffset].fxAtt;                                                
      // spice - variable addition of effect filters
      celody.tempFla = celody.soundOptions[celody.countOffset].fxFla;               
      celody.tempLow = celody.soundOptions[celody.countOffset].fxLow;                
      if (Math.random() < celody.streamInfo[0].spice * 0.85) {                                                             
          if (Math.random() > 0.5) {                       
              celody.tempFla = randomDirection(celody.tempFla,Number(celody.tempFla),Number(celody.streamInfo[0].spice * Math.random()));                                                                           
          } else {    
              celody.tempLow = randomDirection(celody.tempLow,Number(celody.tempLow),Number(celody.streamInfo[0].spice * Math.random()));                                    
          }
          // lower volume to prevent clipping
          if ((celody.soundOptions[celody.countOffset].instrument !== "drum") && (celody.drumIndex !== "mute")) {celody.tempVol = 0.3;}                                         
      }                         
      celody.tempOffset = celody.soundOptions[celody.countOffset].baseStart;                        

      // reset volume and effects
      celody.soundFile[celody.countOffset].volume = celody.tempVol;            
      celody.soundFile[celody.countOffset].release = celody.tempRel;
      celody.soundFile[celody.countOffset].attack = celody.tempAtt;            
      celody.soundFX[celody.countOffset].fxFla.speed = celody.tempFla;                        
      celody.soundFX[celody.countOffset].fxLow.frequency = Math.round( celody.tempLow * 22000);                
      celody.soundFX[celody.countOffset].fxPan.pan = Math.round( ((celody.tempPan * 2) - 1) * 10 ) / 10;                                        

      // handle pan if not added - if already added, value should be reset (no remove)
      if (celody.soundFile[celody.countOffset].effects.indexOf(celody.soundFX[celody.countOffset].fxPan) < 0) {celody.soundFile[celody.countOffset].addEffect(celody.soundFX[celody.countOffset].fxPan)}

      // remove all added effects - required to recover from browser fx crashes (throws warning)
      if (celody.soundFile[celody.countOffset].effects.indexOf(celody.soundFX[celody.countOffset].fxFla) >= 0) {celody.soundFile[celody.countOffset].removeEffect(celody.soundFX[celody.countOffset].fxFla);}
      if (celody.soundFile[celody.countOffset].effects.indexOf(celody.soundFX[celody.countOffset].fxLow) >= 0) {celody.soundFile[celody.countOffset].removeEffect(celody.soundFX[celody.countOffset].fxLow);}                

      // add effects (not bypassed)
      if ((celody.tempFla >= 0.11) && (celody.soundFile[celody.countOffset].effects.indexOf(celody.soundFX[celody.countOffset].fxFla) < 0)) {celody.soundFile[celody.countOffset].addEffect(celody.soundFX[celody.countOffset].fxFla)}
      if ((celody.tempLow >= 0.11) && (celody.soundFile[celody.countOffset].effects.indexOf(celody.soundFX[celody.countOffset].fxLow) < 0)) {celody.soundFile[celody.countOffset].addEffect(celody.soundFX[celody.countOffset].fxLow)}
      
      // on play of first sound, set the master time start
      if (!celody.masterStart) {celody.masterStart = performance.now();}

      // make sure sum of actions isn't longer than loop time
      celody.streamInfo[0].performanceNow = performance.now();

      if (celody.streamInfo[0].performanceNow - celody.masterStart < (celody.timePerLoop * 1000)) {
          // clone the object to allow for smooth overlapping of longer sounds
          celody.tempClone[celody.countIndex] = celody.soundFile[celody.countOffset].clone();                            
          // trigger play file adjusting to the master time start  
          if (celody.streamInfo[0].performanceNow - celody.masterStart < (celody.tempOffset * celody.timePerLoop * 1000)) {                        
              celody.tempClone[celody.countIndex].play((celody.tempOffset * celody.timePerLoop) - ((celody.streamInfo[0].performanceNow - celody.masterStart) / 1000),0);                            
              celody.tempClone[celody.countIndex].sourceNode.playbackRate.value = celody.playRate;
          } else {
              // trigger immediately because sound should already have started
              celody.tempClone[celody.countIndex].play(0,0);                                                        
          }
          // remove sound for memory management                        
          celody.tempClone[celody.countIndex].on('end', (function(tempClone,countIndex) {                            
              tempClone[countIndex].disconnect();                            
          })(celody.tempClone,celody.countIndex))                            
          
      } else {
          console.log("actions took too long")                        
          break;
      }                                              
      celody.countIndex++;
  }

  // play the next loop recursively        
  loopCount++;
  if (celody.streamInfo[0].stop) {
      // stream has been stopped
      celody.countIndex = 0;            
      while (celody.countIndex < celody.streamInfo[0].primarySounds) {                
          if (celody.tempClone[celody.countIndex]) {celody.tempClone[celody.countIndex].stop();}                            
          celody.countIndex++;
      }
      // clear any timeouts
      if (celodyLoopTimer) {clearTimeout(celodyLoopTimer);}
  } else if (performance.now() - celody.masterStart > (celody.timePerLoop * 1000)) {
      // play immediately because loop has expired
      playCompassStream(celody,loopCount);
  } else {                                  
      celodyLoopTimer = setTimeout(function(){ playCompassStream(celody,loopCount); }, (celody.timePerLoop * 1000) - (performance.now() - celody.masterStart));                                       
  }
  return false;
}

function stopStreams() {
    // stop all sounds and prevent any more loops                        
    if ((celody.streamInfo) && (celody.streamInfo[0])) {
        celody.streamInfo[0].stop = true;
    } else {
        celody.streamInfo = [];
        celody.streamInfo[0] = [];
        celody.streamInfo[0].stop = true;
    }            
    if ((celody.streamInfo) && (celody.streamInfo[0]) && (celody.soundOptions)) {
        celody.countMax = celody.streamInfo[0].primarySounds;
    } else {
        celody.countMax = 0;
    }        
    // clear any timeouts
    if (celodyLoopTimer) {clearTimeout(celodyLoopTimer);}     
    celody.countIndex = 0;            
    while (celody.countIndex < celody.countMax) {                
        if (celody.tempClone[celody.countIndex]) {celody.tempClone[celody.countIndex].stop();}                            
        celody.countIndex++;
    }                            
    return false;
}

// validation functions
function validateString(input,min,max) {
    if (input) { if ((input.length < min) || (input.length > max)) {input = "";} }
    return input;
}
function validateNumber(input) {
    input = Number(input);
    if (input) { if (!Number.isFinite(input)) {input = 0;}
    } else {input = 0;}
    return input;
}
function validateFlag(input) {
    if (input !== "yes") {input = "no";}
    return input;
}
function validateUrl(input,celody) {
    if (input) {                
        if ((input.length < 1) || (input.length > 100000) || (!input.startsWith("https://"))) {
            input = "";
            celody.streamInfo[0].error = true;} 
    } else {celody.streamInfo[0].error = true;}
    return input;
}
function validateArrayString(inputs,celody) {
    var inputLength  = 0;
    var inputCounter  = 0;        
    if (inputs) {inputLength = inputs.length;}           
    while (inputCounter < inputLength) {      
        inputs[inputCounter] = validateString(filterXSS(inputs[inputCounter]),0,2000);            
        if (!inputs[inputCounter]) {celody.streamInfo[0].error = true;}            
        inputCounter++;
    }
    return inputs;
}
function validateArrayNumber(inputs,celody) {                      
    var tempInput = Number(inputs);        
    if (!Number.isFinite(tempInput)) {       
        inputs = 0;
        celody.streamInfo[0].error = true;
    }                        
return inputs;
}          
function validateRange(input,min,max,outMin,outMax) {
    if (input >= max) {input = outMax;} else if (input <= min) {input = outMin;} 
    return input;
}
function validateModule(input) {
    if (input) { 
      if ((input === "core") || (input === "tight") || (input === "slowdeep") || (input === "chipmunk") || (input === "nutzo") || (input === "downhill") || (input === "uphill") || (input === "seesaw") || (input === "timeofday") || (input === "weekend") || (input === "location") || (input === "speed") || (input === "airplane") || (input === "compass")) {
            // do nothing - module is valid
      } else {input = "core";}
    } else {input = "core";}
    return input;
}
function randomDirection(input,parameter1,parameter2) {
    if (Math.random() > 0.5) { 
        input = validateRange((parameter1 - parameter2),0,1,0.1,0.85);        
    } else {
        input = validateRange((parameter1 + parameter2),0,1,0.1,0.85);        
    }
    return input;
}
function randomDirectionOffset(input,parameter1,parameter2,parameter3) {                            
    if (Math.random() > 0.5) {                                                                 
        input = parameter1 - parameter2;              
    } else {                                
        input = parameter1 - parameter2;
    }
    // check that offset does not exceed loop start-end
    if ((input < 0.01) || (input > 0.99)) {
        input = parameter3;
    }            
    return input;
}
function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;
    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }
    if (typeof item === "object" && item !== null) {
        return true;
    }
    return false;
}
