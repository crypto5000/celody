# [Celody](https://celody.com)

[Celody](https://celody.com) is an open source, generative music system that uses the [Web Audio Api](https://www.w3.org/TR/webaudio/) and [Pizzicato.js](https://github.com/alemangui/pizzicato) to create infinite music streams. Every stream is seeded with a programmable file that contains the ingredients for the music. Streams can be forked, merged, modified and published. Celody can also be self-hosted and run in a decentralized P2P manner - where streams are published to a decentralized storage mechanism like The Tangle.

## Hear an Infinite Stream

![Website Preview](https://github.com/crypto5000/celody/blob/master/img/celodyWebsite.gif "Website Preview")

**[Play Infinite Stream at Celody.com](https://celody.com)**

## Infinite Streams

An infinite stream is programmed by inputing a Celody stream file (a .json object) into the Celody core code. The stream file is analogous to a person's DNA and the Celody core code is analogous to a person's environment. Once the stream file is set, the final output is dynamically generated by the core code (which includes pseudorandomness that varies the music output). The core code is a simple javascript module that generates the music in real-time and runs only in the client's browser.

## Celody Stream Files

Every stream file has editable parameters that affect the generated real-time music. You can change almost everything: from adding or deleting instruments; to the volume and timing of individual notes; to adding effect filters; to changing the tempo of the stream; to defining the music's density; to much more. See the "Modifying a Stream File" section below for further details.

## Forks

A fork copies the Celody stream file from an existing stream. To fork, click on the "fork" button on the [Celody](http://celody.com) website:

**[View Fork](https://github.com/crypto5000/celody/img/fork.gif)**

When you fork a stream, all the sound determining parameters get copied exactly. This includes the tempo, default play speed, base unit, bars, background level, dynamics, density, variety, spread, spice and instruments. For non-sound determining parameters, forks either clear the value or create a placeholder. This includes the stream name, artist, create date, prior fork data, prior merge data, tokens, and token addresses.

## Merges

A merge combines information from 2 streams. It takes non-conflicting instruments from Celody stream B and copies it into the file from Celody stream A. The resulting stream file is a combination of both Stream A and Stream B. In comparison to a fork, which starts as an exact sound clone of a stream file, a merge starts as a different soundscape from either of the stream parents. To merge, click on the "merge" button on the [Celody](https://celody.com) website. You will be prompted for the name of the second stream that you want to merge into the first stream:

**[View Merge](https://github.com/crypto5000/celody/img/merge.gif)**

## Modifying a Stream File

If you fork or merge a stream file, you get a new file that you can further edit (and then publish). This provides you with a starting point for creating your own infinite streams. To understand how to control your stream's final shape, this section will walk through a "Hello World" stream file - discussing each key-value pair in the json object one by one. 

Hello World Stream File:
```json
{    
    "streamName": "Hello World",
    "artist": "Artist Name",                
    "createDate": "05-23-2019",    
    "tokens": ["IOTA","IOTA"],
    "tokenAddresses": ["99999999999...","ABC99999999..."],    
    "playSpeed": 1.0,
    "tempo": 100,
    "bars": 8,
    "beatsPerBar": 4,    
    "baseUnit": 128,
    "backgroundLevel": 0.85,
    "dynamics": 0.2,
    "density": 0.6,
    "variety": 0.3,             
    "spread": 0.4,                    
    "spice": 0.3,
    "instruments": {                                                            
        "0": [
            {
                "instrument": "drum",
                "type": ["primary"],
                "color": "rgb(255,123,255)",
                "fileSource": ["https://celody.com/sounds/drum/kick/k12d.mp3","https://celody.com/sounds/drum/kick/k13m.mp3",],
                "basePhrase": [0,1,0],
                "baseStart": [0.0010,0.5000,0.8750],                     
                "volumeStart": [0.5,0.6,0.5],
                "fxFla": [0,0,0],                      
                "fxLow": [0,0,0],                      
                "fxAtt": [0.4,0.4,0.4],                     
                "fxRel": [0.5,0.5,0.5],                     
                "fxPan": [0.65,0.65,0.65]
            }                            
        ],
        "1": [
            {
                "instrument": "bell",
                "type": ["primary"],
                "color": "rgb(0,123,255)",
                "fileSource": ["https://celody.com/sounds/bell/a1.mp3"],                                                
                "basePhrase": [0,0],                                
                "baseStart": [0.25,0.75],                     
                "volumeStart": [0.5,0.6],                     
                "fxFla": [0.0,0.0],
                "fxLow": [0.4,0.4],                                
                "fxAtt": [0.4,0.4],                     
                "fxRel": [0.5,0.5],                     
                "fxPan": [0.4,0.4]                                                     
            }
        ]        
    }
}    
```

### Basic Structure

The stream file contains 2 basic sections: 1) the metadata settings for the stream (this includes the streamName up to the spice parameter); 2) the instruments (which contains details on the individual sounds). The Hello World steam only shows 2 instruments, but you can add as many as you want. To add another, you'd create an object "2" under the "1" object inside of the instruments object.

NOTE: Streams published to Celody.com include a few more key-value pairs in the metadata section. Mostly, these are just uuids to be able to uniquely identify the stream during search results. If you publish to the Tangle, you do not need these uuid values.

### streamName (Type: String, Required, Min Length 1, Max Length 250)

The streamName is the display name for the infinite stream. This value will be displayed to the listener in the UI at celody.com.

### artist (Type: String, Required, Min Length 1, Max Length 250)

The artist is the creator of the stream. It can be a pseudonymous user name. The artist is less prominent than the streamName on celody.com.

### createDate (Type: String, mm-dd-yyyy format, Required, Min Length 10, Max Length 10)

The date the stream is published to either celody.com or the Tangle.

### tokens (Type: Array) and tokenAddresses (Type: Array)

An artist can leave a cryptocurrency donation address for financial appreciation. The tokens array should match the address on a slot for slot basis. In other words, both arrays should have the same length. In the Hello World stream, the artist has left 2 IOTA donation addresses.

### playSpeed (Type: Number, Required, Recommended 1.0, Min 0.5, Max 2.0)

The playSpeed parameter is a direct manipulation of the play rate and pitch for the audio. The default value is 1.0 - which plays all the audio at its normal speed. A value above 1.0 will play the audio quicker - which both increases the pitch of the audio and decreases the duration of the audio. A value below 1.0 will increase the audio duration and decrease the pitch.

Note: changing playSpeed does NOT hold pitch constant - as granular synthesis and phase-shift techniques do.

### tempo (Type: Number, Required, Recommended between 30 and 150)

Every stream has a pulse in beats per minute called "tempo". The pulse is an equilibrium tempo that forms a backbone to the stream. A faster tempo is associated with "focus"-based music. A slower tempo is associated with "relaxation"-based music. 

### bars (Type: Number, Required, Recommended 8)

The Celody core code works on a loop. With each iteration of the loop, the core code generates a unique music stream based on the stream file parameters. The time length of the loop is determined by the number of bars and the tempo. More bars creates a longer loop canvas. And a faster tempo will create a shorter loop time.

### beatsPerBar (Type: Number, Required, Recommended 4) and baseUnit (Type: Number, Required, Recommended 128)

The beatsPerBar is a metric that relates to the music signature. 4 refers to quarter notes. 8 refers to eighth notes. 16 refers to sixteenth notes. 64 refers to sixty-fourth notes. All these different beatsPerBar can used to translate music in standard notation form into the celody stream file format.

The baseUnit is the smallest subdivision of a single bar. 128 means 128th notes and is the recommended value. The baseUnit can be used as an quantized offset or to perform a swing beat. The current core code doesn't implement this feature, but it has been used in previous versions. 

### Adding Secondary Sounds to Hello World

The current Hello World stream only has primary sounds. For simplicity, any secondary sounds were excluded. Secondary sounds are shadow instruments that randomly mix to add variety. For example, there could be a secondary drum object added to the instruments object. This secondary drum could have different sounds.

Here is the Hello World Stream File with a secondary drum and secondary bell added:
```json
{    
    "streamName": "Hello World",
    "artist": "Artist Name",                
    "createDate": "05-23-2019",    
    "tokens": ["IOTA","IOTA"],
    "tokenAddresses": ["99999999999...","ABC99999999..."],    
    "playSpeed": 1.0,
    "tempo": 100,
    "bars": 8,
    "beatsPerBar": 4,    
    "baseUnit": 128,
    "backgroundLevel": 0.85,
    "dynamics": 0.2,
    "density": 0.6,
    "variety": 0.3,             
    "spread": 0.4,                    
    "spice": 0.3,
    "instruments": {                                                            
        "0": [
            {
                "instrument": "drum",
                "type": ["primary","2"],                
                "color": "rgb(255,123,255)",                
                "fileSource": ["https://celody.com/sounds/drum/kick/k12d.mp3","https://celody.com/sounds/drum/kick/k13m.mp3"],
                "basePhrase": [0,1,0],
                "baseStart": [0.0010,0.5000,0.8750],                     
                "volumeStart": [0.5,0.6,0.5],
                "fxFla": [0,0,0],                      
                "fxLow": [0,0,0],                      
                "fxAtt": [0.4,0.4,0.4],                     
                "fxRel": [0.5,0.5,0.5],                     
                "fxPan": [0.65,0.65,0.65]
            }                            
        ],
        "1": [
            {
                "instrument": "bell",
                "type": ["primary","3"],      
                "color": "rgb(0,123,255)",
                "fileSource": ["https://celody.com/sounds/bell/a1.mp3"],                                                
                "basePhrase": [0,0],                                
                "baseStart": [0.25,0.75],                     
                "volumeStart": [0.5,0.6],                     
                "fxFla": [0.0,0.0],
                "fxLow": [0.4,0.4],                                
                "fxAtt": [0.4,0.4],                     
                "fxRel": [0.5,0.5],                     
                "fxPan": [0.4,0.4]                                                     
            }
        ], 
        "2": [
            {
                "instrument": "drum",
                "type": ["secondary"],      
                "color": "rgb(255,123,255)",
                "fileSource": ["https://celody.com/sounds/drum/kick/k14.mp3"],
                "basePhrase": [0,0,0],
                "baseStart": [0.0010,0.5000,0.8750],                     
                "volumeStart": [0.5,0.6,0.5],
                "fxFla": [0,0,0],                      
                "fxLow": [0,0,0],                      
                "fxAtt": [0.4,0.4,0.4],                     
                "fxRel": [0.5,0.5,0.5],                     
                "fxPan": [0.65,0.65,0.65]
            }                            
        ],
        "3": [
            {
                "instrument": "bell",
                "type": ["secondary"],      
                "color": "rgb(0,123,255)",
                "fileSource": ["https://celody.com/sounds/bell/a2.mp3"],                                                
                "basePhrase": [0,0],                                
                "baseStart": [0.25,0.75],                     
                "volumeStart": [0.5,0.6],                     
                "fxFla": [0.0,0.0],
                "fxLow": [0.4,0.4],                                
                "fxAtt": [0.4,0.4],                     
                "fxRel": [0.5,0.5],                     
                "fxPan": [0.4,0.4]                                                     
            }
        ]               
    }
}    
```
There are several differences with this updated file. First, we added both a "2" and "3" object to the instruments object. This is the second drum and the second bell. With each iteration of the celody core loop, the code will randomly choose whether to use a primary or secondary sound.

Second, the type object of each primary instrument now has an added parameter in the array which corresponds to the linked secondary instrument. For example, the "1" object type now has a type of ["primary","3"] which links the secondary bell. In addition, we have added a type of ["secondary"] to both of the shadows.

Third, the secondary shadow instrument does not need to have the same number of fileSource elements. In this example, there is only 1 drum sound being loaded as a secondary shadow. However, the number of sounds for the shadow instrument should match the number of sounds of the primary instrument. This is because the shadow performs 1-to-1 substitution with the primary. Make sure the length of the basePhrase is the same between the shadow and the primary object.

### backgroundLevel (Type: Number, Required, Recommended 0.65, Min of 0.1, Max of 1.0)

Celody is intended as background music. Most people use it to focus while coding or reading or listening to podcasts. In other words, it's supposed to be in the background. The backgroundLevel adjusts the overall volume of the stream. A higher value lowers the volume - meaning that it pushes the stream more into the background. A lower value will increase the volume.

### dynamics (Type: Number, Required, Recommended 0.3, Min of 0.1, Max of 1.0)

Dynamics control the additional volume changes to the instrument sounds.  A number closer to 1.0 will create larger volume movements in the sound. A smaller dyanmics value (closer to 0.1) will keep the original volume mostly constant. Dyanmics can be seen as the variance in the volume of the sound.

### density (Type: Number, Required, Recommended 0.5, Min of 0.1, Max of 1.0)

Density controls the number of sounds played during a loop. As the Celody core loops, each note has a probability of being played which is affected by the density parameter. A density of 1.0 means that most notes will likely be played. And a density closer to 0.1 means that most notes will be muted.

### variety (Type: Number, Required, Recommended 0.3, Min of 0.1, Max of 1.0)

Variety controls how often a secondary sound is substituted for a primary sound. The higher the variety value (closer to 1.0) the more often substitutions are made. The variety also controls how often the playspeed of a single loop changes - pitch shifting at certain intervals and increasing/decreasing sound duration. A higher variety will cause more pitch and duration shifts.

### spread (Type: Number, Required, Recommended 0.3, Min of 0.1, Max of 1.0)

Spread controls the left-right panning of the individual sounds. A higher spread will move the position of the sound over a greater range. This means that a sound can move from one ear to the other when wearing headphones. A smaller spread means the sound will stay in a tighter stereo position.

### spice (Type: Number, Required, Recommended 0.3, Min of 0.1, Max of 1.0)

Spice controls how often an effects filter is applied to the sound. A higher spice (closer to 1.0) means that it's more likely a sound will have an effect. Lower spice values (closer to 0.1) will translate to less use of effects. Note: The current effects used in the Celody core code is a low pass filter and a flanger.

### Instruments

The Instruments object contains all the instruments, including the source audio files and sound timing. The Instruments object should contain the primary sounds first, followed by the secondary sounds.

#### instrument (Type: String, Required, Min Length 1, Max Length 250)

The instrument is the name of the instrument producing the sound - like piano, drum, or guitar. This name gets displayed to the user in the celody.com UI. The instrument name should be the same for the corresponding primary and secondary sources. For example, in the modified Hello World Stream with secondary sources, both "0" and "2" have an instrument value of "drum".

#### type (Type: Array, Required)

The type specifies whether the instrument is a primary or secondary. The first value in the array should be either "primary" or "secondary". And if the instrument is primary with a corresponding secondary shadow, the second object in the array should be the linked "secondary" object. For example, in the modified Hello World stream, the primary drum is object "0" and the secondary drum is object "2". This means that the type for object "0" is ["primary","2"] and the type for object "2" is ["secondary"]. Note that we have explicitly linked the secondary drum to the primary drum using the second parameter in the type object array.

#### color (Type: String, Min Length 1, Max Length 50)

The color is used for the generative art display on the celody.com website. This is a visual representation of the rhythm of the infinite music stream. The rbg values is a color format that is supported by browsers that is specified by rgb(red,green,blue). Each parameter (red, green, and blue) defines the intensity of the color as an integer between 0 and 255. If you don't want to generate art on the html canvas, you can leave this null.

#### fileSource (Type: Array, Required)

The fileSource takes the source for the audio of the instrument. Celody includes a number of instrument sounds that can be downloaded from the celody.com/sounds folder or found in the sounds folder of this repo. These sounds are offered under the MIT License and can be used for any purpose. If you are hosting the core code yourself, you would include the sourceUrl for your audio files here.

#### basePhrase (Type: Array, Required)

The basePhrase contains the ordering of the fileSource for each loop of the Celody core code. For example, the Hello World example shows the primary drum has a basePhrase of [0,1,0]. This corresponds to the fileSource[0] being played, then the fileSource[1] audio being played, then the fileSource[0] audio being played. So first you'd hear the k12d.mp3 play, then you'd hear the k13m.mp3, then you'd hear the k12d.mp3 play again. In other words, the basePhrase shows the ordering of the fileSource play events.

#### baseStart (Type: Array, Required, Elements Between 0.0 and 1.0)

So the basePhrase shows the ordering of the fileSource play events, but it doesn't determine when to play these events during the Celody core loop. The baseStart array handles the timing. Each baseStart array should match up on a 1-to-1 basis with the basePhrase and indicate the % time of when to start. This percentage is on a 1 loop basis - where 1 means 100%. So a value of 0.5000 would mean to start the audio at the halfway (50%) mark of the loop. If a loop had 8 bars, this would mean playing the audio at the start of bar 4.

In the Hello World stream, the "0" drum object has a baseStart of [0.0010,0.5000,0.8750]. This means that the basePhrase: [0,1,0] will have the first fileSource play at .0010 * timePerLoop (or almost immediately), the second fileSource play at 0.5 * timePerLoop (or the halfway mark) and then the last element would play at .8750 * timePerLoop.                 

#### volumeStart (Type: Array, Required, Recommended 0.5, Elements Between 0.0 and 1.0)

The volumeStart corresponds on a 1-to-1 basis with the basePhrase. It indicates the start volume of each of the audio sounds. A value of 0.0 is mute and a volume of 1.0 is the loudest maximum. In the Hello World stream, the "0" drum object has a volumeStart of [0.5,0.6,0.5]. This means the first basePhrase element starts with a volume of 0.5, the second with a volume of 0.6, and the last with a volume of 0.5. It is recommended not to use values close to 1.0 because of volume spikes which would cause audio clipping.

#### fxXXX (Type: Array, Required)

The fx values correspond on a 1-to-1 basis with the basePhrase. This applies an effect filter to the fileSource. The current effects are Flanger, Low Pass Filter, Attack, Release, and Panning. To learn more about these effects, you can visit the Pizzicato.js documentation. For the panning filter, a value closer to 0 shifts the sound to the left and value closer to 1 shifts the sound to the right. Experiment to see what works best for your stream.

## Publishing a Stream File

The infinite stream is generated on a user's device in real-time and requires very little bandwidth. In fact, if the fileSource audio has already been downloaded and cached, then the stream can play forever without any internet connection. In practice, a user will open a browser tab that will download the audio files and the stream file and then run the Celody core code on their local device.

There are 2 different ways to run an infinite stream. Celody.com offers a centralized, easy-to-use interface that runs the Core Code, downloads the audio fileSource and imports the json stream files that have been published to Celody. This is the "easiest" choice to get started playing and managing streams.

The second option is completely decentralized (see the section below "Streams on Your Own Site"). It's possible to host the Core Code on your own site (with the corresponding audio fileSources) and then get stream files that have been published to the Tangle. This approach does not use celody.com.

### Publishing to Celody

If you fork, merge and then further edit the stream, you can publish your stream on the celody.com website. The process is shown below:

**[View Publishing to Celody](https://github.com/crypto5000/celody/img/publishcelody.gif)**

If you publish to Celody.com, your stream will get an associated uuid and will be available for others to listen at the celody.com website. Celody.com will perform a best effort to keep your stream available indefinitely.

### Publishing to the Tangle

You have the option to publish your stream into the Tangle from celody.com or using IOTA's Trinity wallet. This process is just publishing your .json stream file into the data payload of an IOTA transaction. To make a data transaction, you should download the [Trinity IOTA wallet](https://trinity.iota.org/). Note you will not need any IOTA currency to publish your stream file. The IOTA protocol allows for zero-valued data transactions. 

IOTA data transactions have a length limit. Even though, Celody stream files are extremely small, it's possible to compress the json object to make it even smaller. If you are publishing to the Tangle from celody.com, the stream file is actually compressed 3 different ways: 1) the file does a basic substitution of longer words for short codes; 2) the output of #1 is the compressed using the [Pako Library ](https://github.com/nodeca/pako) which is a zlib port to javascript; 3) the output of #2 is then base64 compressed using [LZ-String](http://pieroxy.net/blog/pages/lz-string/index.html) to convert to only ASCII values for the Tangle. This compression has shown to reduce the text size by over 40%.

**[View Publishing to the Tangle](https://github.com/crypto5000/celody/img/publishtangle.gif)**

After you have the compressed stream text, find the data message section inside of the Trinity wallet and copy your compressed text into the field. Then send your transaction into the Tangle. The transaction should be available for view using a Tangle explorer such as [thetangle.org](https://thetangle.org)

You should keep track of the IOTA address that contains your stream file. You can share this address with other people and they can then listen to your stream on their site (assuming they are hosting their own version of the core code).

NOTE: Celody.com and the core code includes a feature to listen to streams in the Tangle. If you append the parameter iota=ADDRESS to the url, where the ADDRESS is the address of your IOTA transaction, celody.com will import all streams at that address. An example would be, https://celody.com?iota=999999999999999999999999999999999999999999999999999

If you are hosting the code on your own site, you can replace "celody.com" in the code with your domain name. Data stored in the Tangle is not permanent and streams may be deleted during local snapshots.

### Requesting Micropayments

Every stream file includes a section to micropay the artist. Payment is not required, but if you enjoy the stream, you should consider making a micropayment to the creator. Celody is also investigating using the amount and quantity of staked micropayments for a stream as a signal of its quality. So streams that have received (and still contain) the highest value of micropayments would show up higher in the search results on the celody.com website. In other words, micropayments would be 1 signal (out of many) for stream discovery. 

## Streams on Your Own Site/Host (p2p)

The Celody core code is just javascript that runs in a browser-based environment. The code is available in the source folder of this repo. You can host the code yourself and run a stream without using celody.com. 

The .json stream files can either be sourced from the Tangle (as described in the section "Publishing to the Tangle") or just extracted and embedded directly into your site's code.

Steps to Host Your Own Stream:
1) Include [Pizzicato.js](https://github.com/alemangui/pizzicato) in your site. 
2) Host all the audio files included in the fileSource parameter of your stream file. (change the celody.com domain url)
3) Include the Celody Core javascript code in your site.
4) Import the .json stream file (either from The Tangle or on your own)
5) Validate and clean the stream file for malicious input [XSS](https://github.com/leizongmin/js-xss)

There are working Hello World examples in the example folder of this repo. You'll find a basic example of a page that does not use celody.com.

Note: Pizzicato.js requires that the audio files be hosted on a web server. You can't load the .mp3 or .ogg files locally or the browser will throw an error.

## License

Celody is open source software. All of the code and sounds are released under the [MIT](https://github.com/crypto5000/celody/LICENSE) license, which means you can use them for any purpose, even for commercial projects.

## Contributing

As open source software, Celody welcomes contributions - especially music enthusiasts who want to improve the source code. If you have a feature or bug that you want to commit code for, please open up an [issue](https://github.com/crypto5000/celody/issues) to discuss the implementation details. This will prevent duplicate effort from potential contributors.

Possible areas of contribution include:

* Extending the effect filters beyond low pass filters, flangers, etc. 
* Performance and memory management optimization
* Integration with other open source libraries such as Tone.js
