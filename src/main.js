/*
	Copyright (C) 2018 YuriiPanazdyr. All rights reserved.
	Contacts: <panazdur@ukr.net>
*/

let app = new PIXI.Application();
document.body.appendChild(app.view);


// create a background...
let background = PIXI.Sprite.fromImage('img/game_background.jpg');
background.width = app.screen.width;
background.height = app.screen.height;

// variables to store indents from the top and left... 
let padding_left=(app.screen.width-290)/2;
let padding_top=(app.screen.height-350)/2;

// add background to stage...
app.stage.addChild(background);

// create some textures from an image path
let textureButton;
let textureButtonOver;

// We make the buttons disabled while the function searches for a group of identical cards.
let buttons_disabled = false;

// variable for storing a random value
let ran;
function random(min, max) {
    return Math.floor(Math.random() * (max - min+1) ) + min;
}

//Functions for determining the position of card by x and y.
let button_position_x=padding_left;
function appoint_button_position_x(i){
    if(i===0){
        return button_position_x;
    }
    else if(button_position_x===(padding_left+(50*5))){
        button_position_x=padding_left;
        return button_position_x;
    }
    else {
        return button_position_x+=50;
    }
};
let button_position_y=padding_top;
function appoint_button_position_y(i){
    if(i===0){
        return button_position_y;
    }
    if(button_position_x===padding_left){
        button_position_y+=50;
        return button_position_y;
    }
    else {
        return button_position_y;
    }
};

//Create and add 42 cards.
for (let i = 0; i < 42; i++) {
    //Randomly determine the group id of card
    ran = random(1,4);
    if(ran===1){
        textureButton = PIXI.Texture.fromImage('../img/card_1.png');
    }
    else if(ran===2){
        textureButton = PIXI.Texture.fromImage('../img/card_2.png');
    }
    else if(ran===3){
        textureButton = PIXI.Texture.fromImage('../img/card_3.png');
    }
    else if(ran===4){
        textureButton = PIXI.Texture.fromImage('../img/card_4.png');
    }
    let button = new PIXI.Sprite(textureButton);
    button.buttonMode = true;

    button.anchor.set(0);
    button.name = i;
    button.x = appoint_button_position_x(i);
    button.y = appoint_button_position_y(i);
    button.width = 40;
    button.height = 40;
    button.group_id = ran;

    // make the button interactive...
    button.interactive = true;
    button.buttonMode = true;

    button
        .on('pointerdown', onButtonDown)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);

    // add buttom to the stage
    app.stage.addChild(button);
}


//This function finds and hide a group of same cards
function find_goup_same_cards(button_id, search_group_id){
    buttons_disabled = true;

    let button_id_now_check = button_id;
    let buttons_need_check = [button_id];
    let buttons_need_hide = [button_id];

    //This function compares cards and if their groups id is same, return true...
    function equals_group_id(id, group_id) {
        if(app.stage.getChildByName(id).group_id===group_id){
            return true;
        }
        else {
            return false;
        }
    }

    //This function searches for a value in an array and adds it to the array if it is not there...
    function push_unique_value_in_array(arr_name, value) {
        if (arr_name.indexOf(value) === -1){
            arr_name.push(value);
        }
    }

    //Run search group of same cards
    search();


    function search(){
        
        let top_button_id = button_id_now_check-6;
        let bottom_button_id = button_id_now_check+6;
        let left_button_id = button_id_now_check-1;
        let right_button_id = button_id_now_check+1;

        //Check TOP card
        if(top_button_id >= 0){
            if(equals_group_id(top_button_id, search_group_id)){
                push_unique_value_in_array(buttons_need_check, top_button_id);
                push_unique_value_in_array(buttons_need_hide, top_button_id);
            }
        }
        //Check BOTTOM card
        if(bottom_button_id < 42){
            if(equals_group_id(bottom_button_id, search_group_id)){
                push_unique_value_in_array(buttons_need_check, bottom_button_id);
                push_unique_value_in_array(buttons_need_hide, bottom_button_id);
            }
        }
        //Check LEFT card
        if(button_id_now_check!==0 && button_id_now_check!==6 && button_id_now_check!==12 && button_id_now_check!==18 && button_id_now_check!==24 && button_id_now_check!==30 && button_id_now_check!==36){
            if(equals_group_id(left_button_id, search_group_id)){
                push_unique_value_in_array(buttons_need_check, left_button_id);
                push_unique_value_in_array(buttons_need_hide, left_button_id);
            }
        }
         //Check RIGHT card
        if(button_id_now_check!==5 && button_id_now_check!==11 && button_id_now_check!==17 && button_id_now_check!==23 && button_id_now_check!==29 && button_id_now_check!==35 && button_id_now_check!==41){
            if(equals_group_id(right_button_id, search_group_id)){
                push_unique_value_in_array(buttons_need_check, right_button_id);
                push_unique_value_in_array(buttons_need_hide, right_button_id);
            }
        }
        search_continue_or_not();
    }

    //This function checks the queue and if the element was the last one finishes the search
    function search_continue_or_not() { 
        if(buttons_need_check[buttons_need_check.length - 1]===button_id_now_check){
            end();
        }
        else{
            button_id_now_check = buttons_need_check[buttons_need_check.indexOf(button_id_now_check)+1];
            search();
        }
    }

    //This function checks:
    // -a: if one card was found, nothing happens..
    // -b: if group of cards was found, function change the texture and after x time the cards hide.
    function end(){
        if(buttons_need_hide.length==1){
            buttons_disabled = false;
        }
        else {
            for (const index in buttons_need_hide) {
                if (buttons_need_hide.hasOwnProperty(index)) {
                    if(search_group_id===1){
                        app.stage.getChildByName(buttons_need_hide[index]).texture = PIXI.Texture.fromImage('../img/card_1_disabled.png');
                    }
                    else if(search_group_id===2){
                        app.stage.getChildByName(buttons_need_hide[index]).texture = PIXI.Texture.fromImage('../img/card_2_disabled.png');
                    }
                    else if(search_group_id===3){
                        app.stage.getChildByName(buttons_need_hide[index]).texture = PIXI.Texture.fromImage('../img/card_3_disabled.png');
                    }
                    else if(search_group_id===4){
                        app.stage.getChildByName(buttons_need_hide[index]).texture = PIXI.Texture.fromImage('../img/card_4_disabled.png');
                    }
                }
            }
            let timer = setTimeout(function() {
                for (const index in buttons_need_hide) {
                    if (buttons_need_hide.hasOwnProperty(index)) {
                        app.stage.getChildByName(buttons_need_hide[index]).visible = false;
                    }
                };
                buttons_disabled = false;
                clearTimeout(timer);
            }, 1000);
        }
    }

    
}


//Functions: onButtonDown, onButtonOver, onButtonOut

function onButtonDown() {
    if (!buttons_disabled) {
        find_goup_same_cards(this.name,this.group_id);
    }
}

function onButtonOver() {
    if (buttons_disabled) {
        this.cursor = 'arrow';
    }
    else if (!buttons_disabled) {
        this.cursor = 'pointer';
        if(this.group_id===1){
            this.texture = PIXI.Texture.fromImage('../img/card_1_hover.png');
        }
        else if(this.group_id===2){
            this.texture = PIXI.Texture.fromImage('../img/card_2_hover.png');
        }
        else if(this.group_id===3){
            this.texture = PIXI.Texture.fromImage('../img/card_3_hover.png');
        }
        else if(this.group_id===4){
            this.texture = PIXI.Texture.fromImage('../img/card_4_hover.png');
        }
    }
}

function onButtonOut() {
    if (buttons_disabled) {
        this.cursor = 'arrow';
    }
    else if (!buttons_disabled) {
        if(this.group_id===1){
            this.texture = PIXI.Texture.fromImage('../img/card_1.png');
        }
        else if(this.group_id===2){
            this.texture = PIXI.Texture.fromImage('../img/card_2.png');
        }
        else if(this.group_id===3){
            this.texture = PIXI.Texture.fromImage('../img/card_3.png');
        }
        else if(this.group_id===4){
            this.texture = PIXI.Texture.fromImage('../img/card_4.png');
        }
    }
}