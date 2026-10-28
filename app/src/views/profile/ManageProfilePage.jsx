import { useState } from "react";
import AnimationLink from "@/components/Animation/AnimationLink";
import Button from "@/components/Buttons/Button";
import styles from "./ManageProfilePage.module.css";

const emptyAddress = {
  firstName: "", lastName: "", company: "", address1: "", address2: "",
  city: "", zip: "", countryCode: "", provinceCode: "", phone: "",
};
const addressLabels = {
  firstName: "First Name", lastName: "Last Name", company: "Company", address1: "Street and Number",
  address2: "Apartment / Additional Address", city: "City", zip: "Postal Code", provinceCode: "State / Province Code", phone: "Phone",
};
const autocomplete = {
  firstName: "given-name", lastName: "family-name", company: "organization", address1: "address-line1",
  address2: "address-line2", city: "address-level2", zip: "postal-code", provinceCode: "address-level1", phone: "tel",
};
const dateLabel = value => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : new Intl.DateTimeFormat("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC",
  }).format(date);
};

export default function ManageProfilePage({ initialProfile, countries, membership, paymentUrl, loadError }) {
  const [profile, setProfile] = useState(initialProfile);
  const [details, setDetails] = useState({ firstName: initialProfile?.firstName || "", lastName: initialProfile?.lastName || "", phone: initialProfile?.phone || "" });
  const [editing, setEditing] = useState(null);
  const [address, setAddress] = useState(emptyAddress);
  const [makeDefault, setMakeDefault] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(loadError);
  const [message, setMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const request = async payload => {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/profile/manage", {
        method: payload ? "POST" : "GET",
        headers: { "Content-Type": "application/json" },
        ...(payload ? { body: JSON.stringify(payload) } : {}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save your changes.");
      setProfile(data.profile);
      if (!payload || payload.action === "details") {
        setDetails({ firstName: data.profile.firstName, lastName: data.profile.lastName, phone: data.profile.phone });
      }
      setMessage(payload ? "Saved." : "");
      return true;
    } catch (error) {
      setError(error.message || "Could not connect. Please try again.");
      return false;
    } finally { setBusy(false); }
  };

  const editAddress = entry => {
    setEditing(entry?.id || "new");
    setAddress({ ...emptyAddress, ...entry, countryCode: entry?.countryCodeV2 || "", firstName: entry?.firstName || details.firstName, lastName: entry?.lastName || details.lastName });
    setMakeDefault(entry ? profile.defaultAddressId === entry.id : profile.addresses.length === 0);
    setPendingDelete(null); setMessage(""); setError("");
  };

  return (
    <main className={styles.main} typo="h3">
      <nav className={styles.navigation}>
        <AnimationLink path="/profile">Profile</AnimationLink>
        <h1 typo="h3">Manage Profile</h1>
      </nav>
      <div className={styles.feedback} aria-live="polite">
        {error ? <p role="alert" className={styles.error}>{error}</p> : message}
        {!profile && <Button disabled={busy} onClick={() => request()}>Try Again</Button>}
      </div>
      {profile && <div className={styles.columns}>
        <section>
          <h2 typo="h3">Personal Details</h2>
          <form onSubmit={async event => { event.preventDefault(); await request({ action: "details", ...details }); }}>
            <fieldset disabled={busy}>
              {["firstName", "lastName", "phone"].map(key => <label key={key} className={styles.field}>
                <span>{addressLabels[key]}</span>
                <input type={key === "phone" ? "tel" : "text"} required={key !== "phone"} maxLength={key === "phone" ? 50 : 255}
                  autoComplete={autocomplete[key]} value={details[key]} onChange={event => setDetails({ ...details, [key]: event.target.value })} />
              </label>)}
              <label className={styles.field}><span>Email</span><input type="email" value={profile.email} readOnly /></label>
              <Button type="submit" disabled={busy}>Save Details</Button>
            </fieldset>
          </form>
        </section>

        <section>
          <h2 typo="h3">Addresses</h2>
          {profile.addresses.length === 0 && editing === null && <p className={styles.dim}>No saved addresses.</p>}
          <ul className={styles.addresses}>
            {profile.addresses.map(entry => <li key={entry.id}>
              <address>
                <p>{[entry.firstName, entry.lastName].filter(Boolean).join(" ")}</p>
                {[entry.company, entry.address1, entry.address2, [entry.zip, entry.city].filter(Boolean).join(" "), entry.province, entry.country, entry.phone]
                  .filter(Boolean).map((line, index) => <p key={index}>{line}</p>)}
              </address>
              {profile.defaultAddressId === entry.id && <p className={styles.dim}>Default Address</p>}
              <div className={styles.actions}>
                <button disabled={busy} onClick={() => editAddress(entry)}>Edit</button>
                {profile.defaultAddressId !== entry.id && <button disabled={busy} onClick={() => request({ action: "addressDefault", addressId: entry.id })}>Make Default</button>}
                <button disabled={busy} onClick={() => setPendingDelete(entry.id)}>Delete</button>
              </div>
              {pendingDelete === entry.id && <div className={styles.confirm}>
                <p>Delete this address?</p>
                <div className={styles.actions}>
                  <button disabled={busy} onClick={async () => {
                    if (await request({ action: "addressDelete", addressId: entry.id })) {
                      setPendingDelete(null);
                      if (editing === entry.id) setEditing(null);
                    }
                  }}>Delete Address</button>
                  <button disabled={busy} onClick={() => setPendingDelete(null)}>Cancel</button>
                </div>
              </div>}
            </li>)}
          </ul>
          {editing === null ? <Button disabled={busy} onClick={() => editAddress(null)}>Add Address</Button> : (
            <form className={styles.addressForm} onSubmit={async event => {
              event.preventDefault();
              if (await request({ action: editing === "new" ? "addressCreate" : "addressUpdate", addressId: editing, address, setAsDefault: makeDefault })) setEditing(null);
            }}>
              <h3 typo="h3">{editing === "new" ? "New Address" : "Edit Address"}</h3>
              <fieldset disabled={busy}>
                {["firstName", "lastName", "company", "address1", "address2", "city", "zip"].map(key => <label key={key} className={styles.field}>
                  <span>{addressLabels[key]}</span>
                  <input type="text" maxLength={255} autoComplete={autocomplete[key]} required={["address1", "city"].includes(key)}
                    value={address[key] || ""} onChange={event => setAddress({ ...address, [key]: event.target.value })} />
                </label>)}
                <label className={styles.field} htmlFor="manage-address-country"><span id="manage-country-label">Country</span>
                  <select id="manage-address-country" aria-labelledby="manage-country-label" required autoComplete="country" value={address.countryCode} onChange={event => setAddress({ ...address, countryCode: event.target.value, provinceCode: "" })}>
                    <option value="">Select Country</option>
                    {countries.map(country => <option key={country.code} value={country.code}>{country.name}</option>)}
                  </select>
                </label>
                {["provinceCode", "phone"].map(key => <label key={key} className={styles.field}><span>{addressLabels[key]}</span>
                  <input type={key === "phone" ? "tel" : "text"} maxLength={255} autoComplete={autocomplete[key]} value={address[key] || ""} onChange={event => setAddress({ ...address, [key]: event.target.value })} />
                </label>)}
                <label className={styles.checkbox}><input type="checkbox" checked={makeDefault} onChange={event => setMakeDefault(event.target.checked)} />Default Address</label>
                <div className={styles.actions}><Button type="submit" disabled={busy}>Save Address</Button><Button disabled={busy} onClick={() => setEditing(null)}>Cancel</Button></div>
              </fieldset>
            </form>
          )}
        </section>

        <section>
          <h2 typo="h3">Membership</h2>
          <dl className={styles.summary}>
            <dt>Status</dt><dd>{membership.active ? "Active" : "No active membership"}</dd>
            {membership.tier && <><dt>Membership</dt><dd>{membership.tier}</dd></>}
            {membership.active && <><dt>Type</dt><dd>{membership.gift ? "Gift Membership" : ["ACTIVE", "PAUSED"].includes(profile.subscriberStatus) ? "Recurring Membership" : "Manual Membership"}</dd></>}
            {dateLabel(membership.startsAt) && <><dt>Member Since</dt><dd>{dateLabel(membership.startsAt)}</dd></>}
            {dateLabel(membership.endsAt) && <><dt>Valid Until</dt><dd>{dateLabel(membership.endsAt)}</dd></>}
            {dateLabel(membership.nextBillingDate) && <><dt>Next Payment</dt><dd>{dateLabel(membership.nextBillingDate)}</dd></>}
          </dl>
          {paymentUrl && ["ACTIVE", "PAUSED"].includes(profile.subscriberStatus) && <a className={styles.paymentLink} href={paymentUrl} target="_blank" rel="noreferrer">Update Payment Details</a>}
          {!membership.active && <AnimationLink path="/memberships">Memberships</AnimationLink>}
        </section>
      </div>}
    </main>
  );
}
