import SqlBizzApp from '../utils/sqlBizzApp';
import { expect } from 'chai';


/*describe('SqlBizzApp Log in', () => {
  it('Should log in to SqlBizzApp', () => {
    const param = {
      user: 'ADMIN',
      password: 'ADMIN',
      dcf: 'C:\\eStream\\SQLAccounting\\Share\\Default.DCF',
      fdb: 'ACC-0003.FDB'
    }
    const sqlBizzApp = new SqlBizzApp(param)
    expect(sqlBizzApp.isLogIn()).to.equal(true);
  });
});

describe('SqlBizzApp Log in', () => {
  it('Should fail to log in to SqlBizzApp', () => {
    const param = {
      user: 'ADMIN',
      password: 'Admin',
      dcf: 'C:\\eStream\\SQLAccounting\\Share\\Default.DCF',
      fdb: 'ACC-0003.FDB'
    }
    const sqlBizzApp = new SqlBizzApp(param)
    expect(sqlBizzApp.isLogIn()).to.equal(false);
  });
});

describe('SqlBizzApp Log in error', () => {
  it('Should show Invalid username and password.', () => {
    const param = {
      user: 'ADMIN',
      password: 'Admin',
      dcf: 'C:\\eStream\\SQLAccounting\\Share\\Default.DCF',
      fdb: 'ACC-0003.FDB'
    }
    const sqlBizzApp = new SqlBizzApp(param)
    expect(sqlBizzApp.getError()).to.contain('Invalid');
  });
});

describe('SqlBizzApp invalid FDB path', () => {
  it('Should show cannot open file', () => {
    const param = {
      user: 'ADMIN',
      password: 'ADMIN',
      dcf: 'C:\\eStream\\SQLAccounting\\Share\\Default.DCF',
      fdb: 'ACC-0004.FDB'
    }
    const sqlBizzApp = new SqlBizzApp(param)
    expect(sqlBizzApp.getError()).to.contain('Cannot');
  });
});*/

describe('SqlBizzApp Pay Invoice', () => {
  it('Should pay invoice.', () => {
    const param = {
      user: 'ADMIN',
      password: 'ADMIN',
      dcf: 'C:\\eStream\\SQLAccounting\\Share\\Default.DCF',
      fdb: 'ACC-0003.FDB'
    }
    const sqlBizzApp = new SqlBizzApp(param)
    const payment = {
      ornumber: 'OR-00004',
      unit_name: '300-S0001',
      description: 'SALES',
      amount: 295,
      invoice_no: 'TEST-124',
      payment_date: '2022-08-23',
      adyen_uuid: 'f56ef332-2290-11ed-b3ce-02c4935ec2c8'
    }
    sqlBizzApp.doPayment(payment);
    expect(sqlBizzApp.getError()).to.equal(null);
  });
});