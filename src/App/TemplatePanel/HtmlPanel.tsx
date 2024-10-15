import React, { useMemo, forwardRef, useImperativeHandle } from 'react';
import { useDocument } from '../../documents/editor/EditorContext';
import HighlightedCodePanel from './helper/HighlightedCodePanel';
import renderToStaticMarkup from '../../email-builder/renderers/renderToStaticMarkup';

const HtmlPanel = forwardRef((props, ref) => {
  const document = useDocument();
  const code = useMemo(() => {
    if (document && document.root) {
      try {
        return renderToStaticMarkup(document, { rootBlockId: 'root' });
      } catch (error) {
        console.error('Error rendering HTML:', error);
        return `Error rendering HTML: ${error.message}\n\nPlease check if all components are properly registered.`;
      }
    }
    return '';
  }, [document]);

  useImperativeHandle(ref, () => ({
    getValue: () => code
  }));

  return <HighlightedCodePanel type="html" value={code} />;
});

export default HtmlPanel;