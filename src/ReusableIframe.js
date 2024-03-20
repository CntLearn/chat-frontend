import React from "react";

const ReusableIframe = ({
  src,
  width,
  height,
  allowFullScreen,
  frameBorder,
  title,
  className,
  ...otherProps
}) => {
  return (
    <iframe
      src={src}
      width={width}
      height={height}
      allowFullScreen={allowFullScreen}
      // frameBorder={frameBorder}
      title={title}
      className={className}
      {...otherProps}
    ></iframe>
  );
};

ReusableIframe.defaultProps = {
  width: "100%",
  height: "400px",
  allowFullScreen: false,
  frameBorder: "0",
  title: "Embedded Content",
  className: "",
};

export default ReusableIframe;

//! 1. **Absolute URLs:**
//!    - Example: `https://example.com/document.pdf`
//!    - Description: An absolute URL includes the full address of the resource, including the protocol (`https://`), domain (`example.com`), and path (`/document.pdf`).

//! 2. **Relative URLs:**
//!    - Example: `/documents/document.pdf`
//!    - Description: A relative URL specifies the path to the resource relative to the current document's location. It does not include the protocol or domain.

//! 3. **Data URLs:**
//!    - Example: `data:text/html,<html><body>Hello%20World!</body></html>`
//!    - Description: A data URL allows embedding data directly into the document, eliminating the need for a separate HTTP request. It consists of the `data:` scheme followed by the data type and the actual data.

//! 4. **Google Docs Viewer URL:**
//!    - Example: `https://drive.google.com/viewer?embedded=true&url=https://example.com/document.pdf`
//!    - Description: Google Docs Viewer allows embedding and viewing various document types (e.g., PDFs) using a URL parameter (`url`) to specify the document's location.

//! 5. **JavaScript URLs:**
//!    - Example: `javascript:alert('Hello, World!')`
//!    - Description: A JavaScript URL executes JavaScript code. While they can be used in iframes, it's essential to be cautious about security implications, as executing untrusted scripts can pose a security risk.

//! 6. **FTP URLs:**
//!    - Example: `ftp://example.com/files/document.txt`
//!    - Description: An FTP URL specifies a resource on an FTP (File Transfer Protocol) server. It can be used to load content from an FTP server.

//! 8. **Blob URLs:**
//!    - Example: `blob:https://example.com/6aefa30b-a3aa-4994-849b-56804f9b3fe1`
//!    - Description: Blob URLs represent data as a `Blob` object and are often used for creating object URLs for binary data.

//! 9. **About URLs:**
//!    - Example: `about:blank`
//!    - Description: `about` URLs are used for various internal browser pages. `about:blank` is commonly used to load a blank page.
