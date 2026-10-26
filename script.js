//--------- Mind map - Steps!! ---------
//Load countries in selectors (Done!)
//Load country flags          (Done!)
//Verify if the input is correct (Done!)
//Communicate with API (Done!)
//Send the input (Done!)
//Handle the response + Error (...)
//Make the swap button work (Done!)
//Erase the input after every conversion (Done!)
//ADDITIONAL FEATURE: on swap the last entered value will be coverted automatically!

const user_input = document.querySelector('#user_input');
const swapBtn = document.querySelector('#swap_button');

// Currenct selectors
const fromCurr = document.querySelector('#from_curr');
const toCurr = document.querySelector('#to_curr');

//Convert Button
const conversion = document.querySelector('#convertBtn');

//Display Area
const display = document.querySelector('.display_box');

//For loading flags in place
const from_flag = document.querySelector('#from_flag');
const to_flag = document.querySelector('#to_flag');


//Filling the select options
for (const country_key in COUNTRY_NAMES)
{
    const key = country_key;
    fromCurr.innerHTML += `<option value="${key}">${key} || ${COUNTRY_NAMES[key]}</option>`;
    toCurr.innerHTML += `<option value="${key}">${key} || ${COUNTRY_NAMES[key]}</option>`;
} 

//flags not in the same loop for functionality!
const update_flags = () => {
    //Catching the selected options
    let key_from = fromCurr.value;
    let key_to = toCurr.value;

    //preparing the country key
    let country_key_from = key_from.slice(0, 2);
    let country_key_to = key_to.slice(0, 2);

    //Displaying the flag in place
    from_flag.src = `https://flagsapi.com/${country_key_from}/shiny/32.png`;
    to_flag.src = `https://flagsapi.com/${country_key_to}/shiny/32.png`;
}

//Test and show default flags
update_flags();

//Using change to trigger the function on selection of a country!
fromCurr.addEventListener('change', update_flags);
toCurr.addEventListener('change', update_flags);

//Verification cases:
/*
1- Actual positive number -> Valid input
2- left empty -> default = 1
3- zero - negative or NaN -> default = 1 
*/

let last_val = 1; //For the swap auto conversion feature!!
conversion.addEventListener('click', async () => {
    let amount_val = user_input.value;
    if (amount_val === "") {
        amount_val = last_val; //The default value for last_value is 1 so it will work in all the cases!!
} else if (amount_val <= 0 || isNaN(amount_val)) {
        amount_val = 1;
        user_input.value = "1"; //Data type inside the input element is string!
    }

    last_val = amount_val; //Update the last value in case of valid input!!

    //Slight loading screen.
    display.innerHTML = `<h3 class="text-light fw-bold">Converting...</h3>`;
    
    //Getting data and activating the conversion!  
    try {
        let bk_res = await fetch(`https://v6.exchangerate-api.com/v6/04990990e3d2f318c3be3d23/latest/${fromCurr.value}`);
        let conversion_Data = await bk_res.json();

        //Catching the selected_To value!
        let rate = conversion_Data.conversion_rates[`${toCurr.value}`];
        let to_Curr_val = parseFloat((rate * amount_val).toFixed(2));
        display.innerHTML = `<h2 class="fw-bold text-light">${amount_val} ${fromCurr.value} = ${to_Curr_val} ${toCurr.value}</h2>`;
        user_input.value = "";
    } catch (error) {
        display.innerHTML = `<h3 class="text-danger fw-bold">Something went wrong. Please try again!</h3>`;
        console.log(error); 
    }
})

swapBtn.addEventListener('click', () => {
    //For selectors
    let temp = toCurr.value;
    toCurr.value = fromCurr.value;
    fromCurr.value = temp;

    //For flags
    update_flags();

    //Auto convert on swap
    conversion.click();
})