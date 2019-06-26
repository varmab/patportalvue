
let typeDefs = `
  input ConnectionInput {
    user: String
    password: String
    server: String
    instance: String
    database: String
  }

  input AppointmentInput {
    RecNo: ID
    PatId: ID
    PatName: String
    DctId: ID
    FclId: ID
    Duration: Int
    AppType: String
    AppDateTime: String
    EntryDateTime: String
  }
  
  type DoctorType {
    RecNo: ID
    DctId: ID
    DctName: String
    ShowInPortal: Boolean
  }
  
  type FacilityType {
    RecNo: ID
    FclId: ID
    FclDesc: String
    ShowInPortal: Boolean
  }

  type CreateAppointmentType {
    RecNo: ID
    PatId: ID
    DctId: ID
    FclId: ID
    Duration: Int
    AppType: String
    AppDateTime: String
    EntryDateTime: String
  }

  type AppointmentType {
    RecNo: ID
    Type: String
    Color: Int
    BookColor: Int
    Description: String
    Panel: String
    icd1: String
    icd2: String
    icd3: String
    icd4: String
    icd5: String
    icd6: String
    icd7: String
    icd8: String
    UseBookColor: Boolean
    Duration: Int
    MaxApps: Int
    Remark: Boolean
    EntryDate: String
    UserId: String
    ShowInPortal: Boolean
  }

  type Query {
    allDoctors(connection:ConnectionInput) : [DoctorType]
    allFacilities(connection:ConnectionInput) : [FacilityType]
    allAppointmentTypes(connection:ConnectionInput) : [AppointmentType]
  }
  
  type Mutation {
    createAppointment(connection:ConnectionInput,appointment:AppointmentInput) : CreateAppointmentType
  }
`;

module.exports = typeDefs;