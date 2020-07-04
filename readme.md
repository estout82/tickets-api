
+ CONTROLLERS
    - contain routing logic
    - make calls to models
    - handle errors
    - custom logic
        - each default route takes a pre / post callback
        - signature (req, res) => {}
        - if return false... request processing is stopped

+ MODELS
 - interact with db
 - contain validation logic

+ HELPER
 - controller
  - generic controller class
  - basic CRUD ops
 - debug
  - debug helper functions
 - validate
  - helper validatoin functions
   - validateId
   - validateIdExists
   - validateUpc