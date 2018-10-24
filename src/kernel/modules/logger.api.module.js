module.exports = (
   hash,
   // Request
   reqMethod,
   reqUrl,
   reqBody,
   // Response
   resStatus,
   resStatusText,
   resBody,
) => {
   let msg = `[DEBUG] ${hash}\n`;
   msg += 'REQUEST\n';
   msg += `\tMethod: [${reqMethod}] ${reqUrl}\n`;
   msg += `\tBody:\n${JSON.stringify(reqBody, null, '\t')}\n\n`;
   msg += 'RESPONSE\n';
   msg += `\tStatus: ${resStatus} (${resStatusText})\n`;
   msg += `\tBody:\n${JSON.stringify(resBody, null, '\t')}\n\n`;
   // logger.info(msg);
   console.log(msg);
};
