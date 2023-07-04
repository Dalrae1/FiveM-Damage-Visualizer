local vehicleDamages = {}

local emptyVehicleDamages = {
    {
        ["Type"] = "wheels",
        ["Component"] = "tireFL", 
        ["Severity"] = 0
    },
    {
        ["Type"] = "wheels",
        ["Component"] = "tireFR",
        ["Severity"] = 0
    },
    {
        ["Type"] = "wheels",
        ["Component"] = "tireRL",
        ["Severity"] = 0
    },
    {
        ["Type"] = "wheels", 
        ["Component"] = "tireRR",
        ["Severity"] = 0
    },
    {
        ["Type"] = "powertrain",
        ["Component"] = "mainEngine",
        ["Severity"] = 0
    },
    {
        ["Type"] = "energyStorage",
        ["Component"] = "mainTank",
        ["Severity"] = 0
    },
    {
        ["Type"] = "body",
        ["Component"] = "FL",
        ["Severity"] = 0,
    },
    {
        ["Type"] = "body",
        ["Component"] = "FR",
        ["Severity"] = 0,
    },
    {
        ["Type"] = "body",
        ["Component"] = "ML",
        ["Severity"] = 0
    },
    {
        ["Type"] = "body",
        ["Component"] = "MR",
        ["Severity"] = 0
    },
}
local currentVehicleDamages = emptyVehicleDamages

function GetEngineDamage(vehicle)
    local damage = math.ceil(GetVehicleEngineHealth(vehicle))
    if damage < 300 then
        return 3
    elseif damage < 600 then
        return 2
    elseif damage < 990 then
        return 1
    else
        return 0
    end
end

function GetTireDamage(vehicle, tireIndex)
    --local damage = math.ceil(GetTyreHealth(vehicle, tireIndex))
    local damage = math.ceil(GetVehicleWheelHealth(vehicle, tireIndex))
    if damage < 300 then
        return 3
    elseif damage < 600 then
        return 2
    elseif damage < 1000 then
        return 1
    else
        return 0
    end
end

function GetFuelTankDamage(vehicle)
    local damage = math.ceil(GetVehiclePetrolTankHealth(vehicle))
    if damage < 300 or GetVehicleFuelLevel(vehicle) == 0.0 then
        return 3
    elseif damage < 600 then
        return 2
    elseif damage < 990 then
        return 1
    else
        return 0
    end
end

function GetDoorHealth(vehicle, doorIndex)
    local windowIndex = doorIndex == 0 and 0 or doorIndex == 1 and 1
    local windowBroken = not IsVehicleWindowIntact(vehicle, windowIndex)
    local doorBroken = IsVehicleDoorDamaged(vehicle, doorIndex)
    if doorBroken then
        return 3
    elseif windowBroken then
        return 2
    else
        return 0
    end
end

function CheckVehicleDamage(vehicle)
    local newVehicleDamages = {
        {
            ["Type"] = "wheels",
            ["Component"] = "tireFL", 
            ["Severity"] = GetTireDamage(vehicle, 0)
        },
        {
            ["Type"] = "wheels",
            ["Component"] = "tireFR",
            ["Severity"] = GetTireDamage(vehicle, 1)
        },
        {
            ["Type"] = "wheels",
            ["Component"] = "tireRL",
            ["Severity"] = GetTireDamage(vehicle, 2)
        },
        {
            ["Type"] = "wheels", 
            ["Component"] = "tireRR",
            ["Severity"] = GetTireDamage(vehicle, 3)
        },
        {
            ["Type"] = "powertrain",
            ["Component"] = "mainEngine",
            ["Severity"] = GetEngineDamage(vehicle)
        },
        {
            ["Type"] = "energyStorage",
            ["Component"] = "mainTank",
            ["Severity"] = GetFuelTankDamage(vehicle)
        },
        {
            ["Type"] = "body",
            ["Component"] = "FL",
            ["Severity"] = GetIsLeftVehicleHeadlightDamaged(vehicle) and 3 or 0,
        },
        {
            ["Type"] = "body",
            ["Component"] = "FR",
            ["Severity"] = GetIsRightVehicleHeadlightDamaged(vehicle) and 3 or 0,
        },
        {
            ["Type"] = "body",
            ["Component"] = "ML",
            ["Severity"] = GetDoorHealth(vehicle, 0)
        },
        {
            ["Type"] = "body",
            ["Component"] = "MR",
            ["Severity"] = GetDoorHealth(vehicle, 1)
        },
    }
    for i, data in pairs(newVehicleDamages) do
        if data.Severity ~= currentVehicleDamages[i].Severity then
            DamageVehicle(vehicle, data.Type, data.Component, data.Severity)
        end
    end
    currentVehicleDamages = newVehicleDamages

end

function GetMinimapAnchor()
    local safezone = GetSafeZoneSize()
    local safezone_x = 1.0 / 20.0
    local safezone_y = 1.0 / 20.0
    local aspect_ratio = GetAspectRatio(0)
    local res_x, res_y = GetActiveScreenResolution()
    local xscale = 1.0 / res_x
    local yscale = 1.0 / res_y
    local Minimap = {}
    Minimap.width = xscale * (res_x / (4 * aspect_ratio))
    Minimap.height = yscale * (res_y / 5.674)
    Minimap.left_x = xscale * (res_x * (safezone_x * ((math.abs(safezone - 1.0)) * 10)))
    Minimap.bottom_y = 1.0 - yscale * (res_y * (safezone_y * ((math.abs(safezone - 1.0)) * 10)))
    Minimap.right_x = Minimap.left_x + Minimap.width
    Minimap.top_y = Minimap.bottom_y - Minimap.height
    Minimap.x = Minimap.left_x
    Minimap.y = Minimap.top_y
    Minimap.xunit = xscale
    Minimap.yunit = yscale
    return Minimap
end

function DamageVehicle(vehicle, componentType, component, damageSeverity)
    local anchor = GetMinimapAnchor()
    SendNUIMessage(
        {
            action = "SetVehicleDamage",
            DamageSeverity = damageSeverity,
            DamageType = componentType,
            DamagedComponent = component,
            MinimapRightX = anchor.right_x/anchor.xunit,
            MinimapTopY = (anchor.bottom_y-anchor.height)/anchor.yunit,
        }
    )
end

function ResetDamage()
    currentVehicleDamages = emptyVehicleDamages
    SendNUIMessage(
        {
            action = "ResetVehicleDamage",
        }
    )
end

function HideDamage()
    ResetDamage()
    SendNUIMessage(
        {
            action = "HideVehicleDamage",
        }
    )
end

local invalidClasses = {
    [8] = true, -- Motorcycles
    [13] = true, -- Cycles
    [14] = true, -- Boats
    [15] = true, -- Helicopters
    [16] = true, -- Planes
    [21] = true -- Trains
}
function isVehicleInvalid(vehicle)
    if not DoesEntityExist(vehicle) then
        return true
    end
    local class = GetVehicleClass(vehicle)
    return invalidClasses[class] or false
end

local lastVehicle = nil
CreateThread(function()
    while true do
        Wait(300)
        local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
        if isVehicleInvalid(vehicle) then
            goto continue
        end
        if vehicle and lastVehicle ~= vehicle then
            ResetDamage()
        end
        CheckVehicleDamage(vehicle)
        ::continue::
        lastVehicle = vehicle
    end
end)