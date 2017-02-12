## Discount and promocode model

### Discount model

    id,
    campaignName,
    description
    
### Promocode code model

    id,
    discountId,
    code,
    numberOfUses,
    discountPct,
    expireDate,
    isDeleted
    

## APIs for add/update Discount and promocode (for only super admin)
    
### Adding new discount 
POST api/admin/discount/add

    Sample input
    {
        campaignName: '10% off',
        description: 'sample description',
        numberOfCoupons: 200, // will generate 200 codes and save to DB
        discountPercent: 10 // value for 'discountPct' of promocode 
        numberOfUses: 2, // default usage limit for each code 
        lengthOfCoupon: 10,
        expireDate: Date
    }


### Get all discounts
GET api/admin/discount/all

    Sample output
    [{
        id: 'f9s89fs9f9sf97s',
        campaignName: '10% off',
        description: 'sample description'
    }, {...}, ...]


### Get all promocodes of a discount
GET api/admin/discount/code/?discountId='f9s89fs9f9sf97s'

    Sample output
    [{
        id: 'ght323l42j3k4fl',
        discountId: 'f9s89fs9f9sf97s',
        code: '3231242785',
        numberOfUses: 2,
        discountPct: 10,
        expireDate: Date
    }, {}, ...]


### Update a promocode 
PUT api/admin/discount/code/edit'

    Sample input
        {
            id: 'ght323l42j3k4fl',
            numberOfUses: 3,
            discountPct: 15,
            expireDate: Date,
            isDeleted: false
        }
        
