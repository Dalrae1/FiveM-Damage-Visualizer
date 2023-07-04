function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
(async () => {
    await waitForElm("#carGroup")

    var svg = document.getElementById("damage"),
            svgCarGroup = hu('#carGroup', svg),
            svgDamageTextContainer = hu('#dmgContainer', svg),
            svgDamageText = hu('#dmgText', svg)

    var greenColor = `rgba(0,   255, 0, 0.6)`,
        orangeColor = `rgba(255, 132, 0, 0.6)`,
        redColor = `rgba(255, 0,   0, 0.6)`,
        noDataColor = 'rgba(0,   0,   0, 0  )',
        textDisplayTime = 2000 // Amount of time damage text is shon in milliseconds
    
    var componentDamageMap =  {
        body : {
            FL:                   { svgId: '#bodyFL',       priority: 2, damageDisplayed: 0, damageText: "Body Damaged",tempDamage: false},
            FR:                   { svgId: '#bodyFR',       priority: 2, damageDisplayed: 0, damageText: "Body Damaged",tempDamage: false},
            ML:                   { svgId: '#bodyML',       priority: 2, damageDisplayed: 0, damageText: "Body Damaged",tempDamage: false},
            MR:                   { svgId: '#bodyMR',       priority: 2, damageDisplayed: 0, damageText: "Body Damaged",tempDamage: false},
            RL:                   { svgId: '#bodyRL',       priority: 2, damageDisplayed: 0, damageText: "Body Damaged",tempDamage: false},
            RR:                   { svgId: '#bodyRR',       priority: 2, damageDisplayed: 0, damageText: "Body Damaged",tempDamage: false}
        },

        engine: {
            oilStarvation:        { svgId: '#engine',       priority: 0, damageDisplayed: 0, damageText: 'Oil Starvation'             ,tempDamage: true},
            coolantHot:           { svgId: '#engine',       priority: 0, damageDisplayed: 0, damageText: 'Coolant Overheating'        ,tempDamage: false},
            oilHot:               { svgId: '#engine',       priority: 0, damageDisplayed: 0, damageText: 'Oil Overheating'            ,tempDamage: false},
            pistonRingsDamaged:   { svgId: '#engine',       priority: 0, damageDisplayed: 0, damageText: 'Piston Rings Damaged'       ,tempDamage: false},
            rodBearingsDamaged:   { svgId: '#engine',       priority: 0, damageDisplayed: 0, damageText: 'Rod Bearings Damaged'       ,tempDamage: false},
            headGasketDamaged:    { svgId: '#engine',       priority: 0, damageDisplayed: 0, damageText: 'Head Gasket Damaged'        ,tempDamage: false},
            turbochargerHot:      { svgId: '#engine',       priority: 0, damageDisplayed: 0, damageText: 'Turbocharger Overheating'   ,tempDamage: false},
            engineIsHydrolocking: { svgId: '#engine',       priority: 0, damageDisplayed: 0, damageText: 'Engine is Hydrolocking'     ,tempDamage: false},
            engineReducedTorque:  { svgId: '#engine',       priority: 0, damageDisplayed: 0, damageText: 'Engine Torque Reduced'      ,tempDamage: false},
            mildOverrevDamage:    { svgId: '#engine',       priority: 0, damageDisplayed: 0, damageText: 'Mild Over Rev Damage'       ,tempDamage: false},
            overRevDanger:        { svgId: '#engine',       priority: 0, damageDisplayed: 0, damageText: 'Over Rev Risk'              ,tempDamage: false},
            overTorqueDanger:     { svgId: '#engine',       priority: 0, damageDisplayed: 0, damageText: 'Over Torque Risk'           ,tempDamage: false},
            engineHydrolocked:    { svgId: '#engine',       priority: 1, damageDisplayed: 0, damageText: 'Engine is Hydrolocked'       ,tempDamage: false},
            engineDisabled:       { svgId: '#engine',       priority: 1, damageDisplayed: 0, damageText: 'Engine Disabled'             ,tempDamage: false},
            blockMelted:          { svgId: '#engine',       priority: 1, damageDisplayed: 0, damageText: 'Block Melted'                ,tempDamage: false},
            engineLockedUp:       { svgId: '#engine',       priority: 1, damageDisplayed: 0, damageText: 'Engine Locked Up'            ,tempDamage: false},
            radiatorLeak:         { svgId: '#radiator',     priority: 1, damageDisplayed: 0, damageText: 'Radiator Leaking'            ,tempDamage: false}
        },
        powertrain: {
            wheelaxleFL:          { svgId: '#wheelaxleFL',  priority: 1, damageDisplayed: 0, damageText: 'Front Left Axle Broken'     ,tempDamage: false },
            wheelaxleFR:          { svgId: '#wheelaxleFR',  priority: 1, damageDisplayed: 0, damageText: 'Front Right Axle Broken'     ,tempDamage: false},
            wheelaxleRL:          { svgId: '#wheelaxleRL',  priority: 1, damageDisplayed: 0, damageText: 'Rear Left Axle Broken'       ,tempDamage: false},
            wheelaxleRR:          { svgId: '#wheelaxleRR',  priority: 1, damageDisplayed: 0, damageText: 'Rear Right Axle Broken'      ,tempDamage: false},
            driveshaft:           { svgId: '#driveshaft' ,  priority: 1, damageDisplayed: 0, damageText: 'Driveshaft Broken'           ,tempDamage: false},
            driveshaft_F:         { svgId: '#driveshaft' ,  priority: 1, damageDisplayed: 0, damageText: 'Front Driveshaft Broken'     ,tempDamage: false},
            mainEngine:           { svgId: '#engine'     ,  priority: 1, damageDisplayed: 0, damageText: 'Engine Damaged'               ,tempDamage: false}
        },
        energyStorage: {
            mainTank:             { svgId: '#fueltank',     priority: 1, damageDisplayed: 0, damageText: 'Fuel Tank Damaged'           ,tempDamage: false}
        },
        wheels: {
            tireFL:               { svgId: '#tireFL',       priority: 0, damageDisplayed: 0, damageText: 'Front Left Tire Burst'      ,tempDamage: false},
            tireFR:               { svgId: '#tireFR',       priority: 0, damageDisplayed: 0, damageText: 'Front Right Tire Burst'     ,tempDamage: false},
            tireRL:               { svgId: '#tireRL',       priority: 0, damageDisplayed: 0, damageText: 'Rear Left Tire Burst'       ,tempDamage: false},
            tireRR:               { svgId: '#tireRR',       priority: 0, damageDisplayed: 0, damageText: 'Rear Right Tire Burst'      ,tempDamage: false},

            brakeFL:              { svgId: '#brakeFL',      priority: 1, damageDisplayed: 0, damageText: 'FL Brake Damaged'            ,tempDamage: false},
            brakeFR:              { svgId: '#brakeFR',      priority: 1, damageDisplayed: 0, damageText: 'FR Brake Damaged'            ,tempDamage: false},
            brakeRL:              { svgId: '#brakeRL',      priority: 1, damageDisplayed: 0, damageText: 'RL Brake Damaged'            ,tempDamage: false},
            brakeRR:              { svgId: '#brakeRR',      priority: 1, damageDisplayed: 0, damageText: 'RR Brake Damaged'            ,tempDamage: false},

            brakeOverHeatFL:      { svgId: '#brakeFL',      priority: 0, damageDisplayed: 0, damageText: 'FL Brake Fading',       tempDamage: true     },
            brakeOverHeatFR:      { svgId: '#brakeFR',      priority: 0, damageDisplayed: 0, damageText: 'FR Brake Fading',       tempDamage: true     },
            brakeOverHeatRL:      { svgId: '#brakeRL',      priority: 0, damageDisplayed: 0, damageText: 'RL Brake Fading',       tempDamage: true     },
            brakeOverHeatRR:      { svgId: '#brakeRR',      priority: 0, damageDisplayed: 0, damageText: 'RR Brake Fading',       tempDamage: true     },

            FL:                   { svgId: '#tireFL',       priority: 1, damageDisplayed: 0, damageText: 'Front Left Tire Broken'      ,tempDamage: false},
            FR:                   { svgId: '#tireFR',       priority: 1, damageDisplayed: 0, damageText: 'Front Right Tire Broken'     ,tempDamage: false},
            RL:                   { svgId: '#tireRL',       priority: 1, damageDisplayed: 0, damageText: 'Rear Left Tire Broken'       ,tempDamage: false},
            RR:                   { svgId: '#tireRR',       priority: 1, damageDisplayed: 0, damageText: 'Rear Right Tire Broken'      ,tempDamage: false}
        }
    }


    function reset(opacity) {
        svgCarGroup.animate({ opacity: opacity, }, 200)
        setTimeout(function () {
            svgCarGroup.animate({ opacity: 0, }, 200)
        }, textDisplayTime*4)
        for (var key in componentDamageMap) {
            for (var val in componentDamageMap[key]) {
                hu(componentDamageMap[key][val].svgId, svg).css({
                    fill: noDataColor
                })
                componentDamageMap[key][val].damageDisplayed = 0
                hu(componentDamageMap[key][val].svgId, svg).n.classList.remove("flashAnim")
            }
        }
    }
    function setDamage(component, color, anim) {
        svgCarGroup.animate({ opacity: 1, }, 200)
        setTimeout(function () {
            svgCarGroup.animate({ opacity: 0, }, 200)
        }, textDisplayTime*4)

        hu(component.svgId, svg).css({
            fill: color
        }).attr({
            class: anim
        }).on('webkitAnimationEnd', function (){
            hu(component.svgId, svg).n.classList.remove("flashAnim")
        })

        
        svgDamageText.css({opacity:1}).text(component.damageText)
        svgDamageTextContainer.css({ opacity: 1 })
        
        setTimeout(function () {
            svgDamageText.animate({opacity: 0,},200)
            svgDamageTextContainer.animate({opacity: 0,},200)
        }, textDisplayTime)
    }

    window.addEventListener('message', async function (event) {
        await waitForElm("#carGroup")
        switch (event.data.action) {
            case 'SetVehicleDamage':
                let damageSeverity = event.data.DamageSeverity
                let damageType = event.data.DamageType
                let damagedComponent = event.data.DamagedComponent
                let minimapRightX = event.data.MinimapRightX
                let minimapTopY = event.data.MinimapTopY
                this.document.getElementById("damage").style.marginLeft = minimapRightX + "px"
                this.document.getElementById("damage").style.marginTop = "calc(-3% + "+minimapTopY+"px)"

                let damageColor = damageSeverity == 0 ? noDataColor : damageSeverity == 1 ? greenColor : damageSeverity == 2 ? orangeColor : redColor
                setDamage(componentDamageMap[damageType][damagedComponent], damageColor, 'flashAnim')

                break;
            case 'ResetVehicleDamage':
                reset(1);
                break
        }
    })
})()

